'use client';

import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { generateWordDocument } from '../utils/documentUtils';

// 为调试信息定义类型
interface DebugInfo {
  [key: string]: any;
}

interface DifyWorkflowProcessorProps {
  title: string;
  description: string;
  inputFields: {
    id: string;
    label: string;
    placeholder: string;
    type?: string;
  }[];
  presets?: { name: string; values: Record<string, string> }[];
  onProcessComplete?: (result: any) => void;
  debugMode?: boolean; // 新增调试模式属性
}

export default function DifyWorkflowProcessor({
  title,
  description,
  inputFields,
  presets = [],
  onProcessComplete,
  debugMode = false, // 默认非调试模式
}: DifyWorkflowProcessorProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const [requestTime, setRequestTime] = useState<number | null>(null);

  // 用于在调试模式下，显示API请求和响应的计时器
  useEffect(() => {
    if (isLoading && requestTime) {
      const timer = setInterval(() => {
        setDebugInfo((prev: DebugInfo) => ({
          ...prev,
          elapsedTime: Date.now() - requestTime
        }));
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [isLoading, requestTime]);

  const logDebug = (name: string, value: any) => {
    if (debugMode) {
      console.log(`[Debug] ${name}:`, value);
      setDebugInfo((prev: DebugInfo) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
    logDebug('inputs_update', { ...inputs, [id]: value });
  };

  const handlePresetClick = (preset: { name: string; values: Record<string, string> }) => {
    setInputs(preset.values);
    logDebug('preset_selected', preset);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.values(inputs).some(value => !value.trim())) {
      setError('所有字段都需要填写');
      logDebug('validation_error', '所有字段都需要填写');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);
    setStreamingText('');
    const startTime = Date.now();
    setRequestTime(startTime);
    logDebug('request_start', { inputs, mode: 'blocking', time: new Date().toISOString() });

    try {
      logDebug('fetch_request', {
        url: '/api/dify',
        method: 'POST',
        body: { inputs, responseMode: 'blocking' }
      });
      
      const response = await fetch('/api/dify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          inputs, 
          responseMode: 'blocking',
          debug: debugMode
        }),
      });

      logDebug('fetch_response_status', {
        status: response.status,
        statusText: response.statusText,
        time: new Date().toISOString(),
        duration: Date.now() - startTime
      });

      if (!response.ok) {
        const errorData = await response.json();
        logDebug('fetch_error', errorData);
        throw new Error(errorData.error || '处理失败');
      }

      const data = await response.json();
      console.log('API 响应数据:', data); // 添加控制台日志
      
      logDebug('fetch_response_data', {
        has_answer: !!data.answer,
        answer_length: data.answer ? data.answer.length : 0,
        full_data: debugMode ? data : '(启用调试模式以查看完整数据)'
      });
      
      // 如果返回了调试信息，记录到调试日志
      if (debugMode && data.debug) {
        logDebug('api_debug_info', data.debug);
      }
      
      // 确保data有效且含有answer字段
      if (!data || typeof data !== 'object') {
        throw new Error('API返回的数据格式无效');
      }
      
      if (!data.answer && data.error) {
        throw new Error(data.error);
      }
      
      // 如果没有answer字段但有其他可能的内容字段
      if (!data.answer && data.output) {
        data.answer = data.output;
      }
      
      // 如果仍然没有answer，尝试查找其他可能包含结果的字段
      if (!data.answer) {
        // 查找响应中可能包含文本内容的字段
        const possibleFields = ['content', 'text', 'result', 'message', 'data'];
        for (const field of possibleFields) {
          if (data[field] && typeof data[field] === 'string') {
            data.answer = data[field];
            console.log(`使用 ${field} 字段作为答案`);
            break;
          }
        }
        
        // 如果所有尝试都失败，使用原始JSON作为结果
        if (!data.answer) {
          data.answer = '无法直接提取结果。原始响应:\n' + JSON.stringify(data, null, 2);
          console.warn('无法从响应中提取文本内容，使用原始JSON');
        }
      }
      
      // 处理结果内容，确保易于阅读
      if (data.answer && typeof data.answer === 'string') {
        // 尝试检测JSON字符串并提取内容
        try {
          if (data.answer.trim().startsWith('{') || data.answer.trim().startsWith('[')) {
            const parsedJson = JSON.parse(data.answer);
            // 如果是JSON并且包含content/output/text等字段，提取内容
            if (parsedJson.output) {
              data.answer = parsedJson.output;
            } else if (parsedJson.content) {
              data.answer = parsedJson.content;
            } else if (parsedJson.text) {
              data.answer = parsedJson.text;
            } else if (parsedJson.data?.outputs?.output) {
              data.answer = parsedJson.data.outputs.output;
            }
          }
        } catch (e) {
          // 不是JSON或解析失败，保持原样
          console.log('内容不是有效的JSON或无需进一步处理');
        }
        
        // 清理可能的HTML标签和特殊格式
        let cleanedAnswer = data.answer;
        
        // 移除HTML标签，保留其内容
        cleanedAnswer = cleanedAnswer.replace(/<[^>]*>?/gm, '');
        
        // 替换连续多个换行为两个换行
        cleanedAnswer = cleanedAnswer.replace(/\n{3,}/g, '\n\n');
        
        // 替换连续多个空格为一个空格
        cleanedAnswer = cleanedAnswer.replace(/[ \t]{2,}/g, ' ');
        
        // 移除包含JSON格式化特征的文本
        const jsonPatterns = [
          /\{\s*"task_id":[^}]+\}/g,  // 移除完整JSON对象，不使用s标志
          /"(id|task_id|workflow_run_id|workflow_id)":\s*"[^"]+"/g,  // 移除ID相关字段
          /"(status|outputs|data)":\s*\{/g,  // 移除状态和输出标记
        ];
        
        for (const pattern of jsonPatterns) {
          cleanedAnswer = cleanedAnswer.replace(pattern, '');
        }
        
        // 移除空行
        cleanedAnswer = cleanedAnswer.split('\n').filter((line: string) => line.trim()).join('\n');
        
        data.answer = cleanedAnswer.trim();
        data.originalAnswer = cleanedAnswer; // 保存原始内容，以备需要
      }
      
      setResult(data);
      logDebug('processing_complete', {
        success: true,
        duration: Date.now() - startTime
      });
      
      if (onProcessComplete) {
        onProcessComplete(data);
      }
    } catch (err) {
      const errorMessage = (err as Error).message || '发生未知错误';
      setError(errorMessage);
      logDebug('processing_error', {
        message: errorMessage,
        duration: Date.now() - startTime
      });
    } finally {
      setIsLoading(false);
      setRequestTime(null);
    }
  };

  const handleStreamingProcess = async () => {
    if (Object.values(inputs).some(value => !value.trim())) {
      setError('所有字段都需要填写');
      logDebug('validation_error', '所有字段都需要填写');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);
    setStreamingText('');
    const startTime = Date.now();
    setRequestTime(startTime);
    logDebug('request_start', { inputs, mode: 'streaming', time: new Date().toISOString() });

    try {
      logDebug('fetch_request', {
        url: '/api/dify',
        method: 'POST',
        body: { inputs, responseMode: 'streaming' }
      });
      
      const response = await fetch('/api/dify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          inputs, 
          responseMode: 'streaming',
          debug: debugMode
        }),
      });

      logDebug('fetch_response_status', {
        status: response.status,
        statusText: response.statusText,
        time: new Date().toISOString(),
        duration: Date.now() - startTime
      });

      if (!response.ok) {
        const errorData = await response.json();
        logDebug('fetch_error', errorData);
        throw new Error(errorData.error || '处理失败');
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';
      let chunkCount = 0;

      logDebug('stream_start', { time: new Date().toISOString() });
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          logDebug('stream_complete', { 
            chunkCount,
            totalLength: fullText.length,
            duration: Date.now() - startTime
          });
          break;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        chunkCount++;
        logDebug('stream_chunk', { 
          chunkNumber: chunkCount,
          chunkSize: chunk.length,
          elapsedTime: Date.now() - startTime
        });
        
        buffer += chunk;
        
        // 处理数据行
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            if (data === '[DONE]') {
              logDebug('stream_done_marker', { time: new Date().toISOString() });
            } else {
              try {
                const parsedData = JSON.parse(data);
                logDebug('stream_data', { 
                  has_answer: !!parsedData.answer,
                  answer_length: parsedData.answer ? parsedData.answer.length : 0
                });
                
                // 如果有调试信息，记录
                if (debugMode && parsedData.debug) {
                  logDebug('stream_debug_info', parsedData.debug);
                }
                
                // 尝试从不同字段中提取内容
                let content = null;
                if (parsedData.answer) {
                  content = parsedData.answer;
                } else if (parsedData.output) {
                  content = parsedData.output;
                } else if (parsedData.content) {
                  content = parsedData.content;
                } else if (parsedData.text) {
                  content = parsedData.text;
                } else if (parsedData.message) {
                  content = parsedData.message;
                } else if (typeof parsedData === 'string') {
                  content = parsedData;
                }
                
                if (content) {
                  fullText += content;
                  setStreamingText(fullText);
                  console.log('接收到流式响应片段:', content.substring(0, 50) + (content.length > 50 ? '...' : ''));
                }
              } catch (e) {
                logDebug('stream_parse_error', { 
                  error: (e as Error).message,
                  data: data.substring(0, 100) + (data.length > 100 ? '...' : '')
                });
                
                // 尝试直接使用文本，可能是纯文本流
                if (data && typeof data === 'string' && data !== '[DONE]') {
                  fullText += data;
                  setStreamingText(fullText);
                  console.log('接收到纯文本流片段:', data.substring(0, 50) + (data.length > 50 ? '...' : ''));
                }
              }
            }
          }
        }
      }

      // 流结束后设置完整结果
      if (fullText) {
        // 清理和格式化内容
        let cleanedAnswer = fullText;
        
        // 移除HTML标签，保留其内容
        cleanedAnswer = cleanedAnswer.replace(/<[^>]*>?/gm, '');
        
        // 替换连续多个换行为两个换行
        cleanedAnswer = cleanedAnswer.replace(/\n{3,}/g, '\n\n');
        
        // 替换连续多个空格为一个空格
        cleanedAnswer = cleanedAnswer.replace(/[ \t]{2,}/g, ' ');
        
        // 移除包含JSON格式化特征的文本
        const jsonPatterns = [
          /\{\s*"task_id":[^}]+\}/g,  // 移除完整JSON对象
          /"(id|task_id|workflow_run_id|workflow_id)":\s*"[^"]+"/g,  // 移除ID相关字段
          /"(status|outputs|data)":\s*\{/g,  // 移除状态和输出标记
        ];
        
        for (const pattern of jsonPatterns) {
          cleanedAnswer = cleanedAnswer.replace(pattern, '');
        }
        
        // 移除空行
        cleanedAnswer = cleanedAnswer.split('\n').filter((line: string) => line.trim()).join('\n');
        
        const resultObj = { 
          answer: cleanedAnswer.trim(),
          originalAnswer: fullText // 保存原始内容
        };
        
        setResult(resultObj);
        // 更新streaming文本为格式化后的内容
        setStreamingText(cleanedAnswer.trim());
        
        logDebug('processing_complete', {
          success: true,
          duration: Date.now() - startTime,
          streaming: true,
          result_length: cleanedAnswer.length
        });
        
        if (onProcessComplete) {
          onProcessComplete(resultObj);
        }
      } else {
        // 如果没有收集到任何内容，设置错误
        throw new Error('未能从流式响应中获取有效内容');
      }
    } catch (err) {
      const errorMessage = (err as Error).message || '发生未知错误';
      setError(errorMessage);
      logDebug('processing_error', {
        message: errorMessage,
        duration: Date.now() - startTime
      });
    } finally {
      setIsLoading(false);
      setRequestTime(null);
    }
  };

  const handleDownload = () => {
    if (!result?.answer || !result.answer.trim()) {
      setError('没有可下载的内容');
      return;
    }
    
    const blob = new Blob([result.answer], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${title}-结果.txt`);
    logDebug('download_txt', { time: new Date().toISOString() });
  };

  const handleDownloadWord = async () => {
    if (!result?.answer || !result.answer.trim()) {
      setError('没有可下载的内容');
      return;
    }
    
    try {
      // 使用刚创建的Word文档生成函数
      await generateWordDocument(result.answer, `${title}-结果`);
      logDebug('download_word', { time: new Date().toISOString() });
    } catch (error) {
      console.error('生成Word文档失败:', error);
      setError(`生成Word文档失败: ${(error as Error).message}`);
    }
  };

  const toggleDebugMode = () => {
    // 创建一个切换调试模式的事件，以便父组件可以响应
    const event = new CustomEvent('toggleDebugMode', { bubbles: true });
    document.dispatchEvent(event);
    
    logDebug('debug_toggled', !debugMode);
  };

  const processInlineMarkdown = (text: string): React.ReactNode => {
    // 如果文本中没有特殊标记，直接返回
    if (!text.includes('**') && !text.includes('*') && !text.includes('`')) {
      return text;
    }

    // 处理文本中的加粗、斜体和代码样式
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let key = 0;

    // 处理加粗文本 (** **)
    const boldRegex = /\*\*(.*?)\*\*/g;
    let boldMatch;
    let lastIndex = 0;

    while ((boldMatch = boldRegex.exec(currentText)) !== null) {
      // 添加前面的普通文本
      if (boldMatch.index > lastIndex) {
        const plainText = currentText.substring(lastIndex, boldMatch.index);
        parts.push(<span key={key++}>{processInlineMarkdown(plainText)}</span>);
      }

      // 添加加粗的文本
      parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
      lastIndex = boldMatch.index + boldMatch[0].length;
    }

    // 添加剩余的文本
    if (lastIndex < currentText.length) {
      const plainText = currentText.substring(lastIndex);
      parts.push(<span key={key++}>{plainText}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-md font-medium mb-2 text-blue-800">使用说明</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <button
            onClick={toggleDebugMode}
            className="text-xs px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            title={debugMode ? "关闭调试模式" : "开启调试模式"}
          >
            {debugMode ? "🐞" : "⚙️"}
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {inputFields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                value={inputs[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.placeholder}
                disabled={isLoading}
                rows={4}
              />
            ) : (
              <input
                type={field.type || 'text'}
                id={field.id}
                value={inputs[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.placeholder}
                disabled={isLoading}
              />
            )}
          </div>
        ))}

        {presets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">预设配置：</span>
            {presets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-300 transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中...
              </span>
            ) : '开始处理'}
          </button>
          
          <button
            type="button"
            onClick={handleStreamingProcess}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-green-300 transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中...
              </span>
            ) : '流式处理'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <div className="flex items-start">
            <div className="mr-3 pt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">处理过程中出错</h4>
              <p className="text-sm">{error}</p>
              <div className="mt-3 text-xs text-red-600">
                <p>可能的解决方案:</p>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>检查网络连接</li>
                  <li>确保Dify API密钥正确</li>
                  <li>确认Dify工作流已发布</li>
                  <li>开启调试模式获取更多信息</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {streamingText && !result && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">生成中...</h3>
            {isLoading && requestTime && (
              <span className="text-sm text-gray-500">
                已用时间: {Math.floor((Date.now() - requestTime) / 1000)}秒
              </span>
            )}
          </div>
          <div className="p-4 bg-gray-50 rounded-md max-h-[500px] overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <div className="formatted-result">
                {streamingText.split('\n').map((line: string, index: number) => {
                  // 处理标题 - 增强型匹配，处理多种格式的标题
                  if (line.match(/^#+\s+.+/)) {
                    const level = line.match(/^(#+)/)?.[0].length || 1;
                    const content = line.replace(/^#+\s+/, '');
                    
                    switch(level) {
                      case 1: return <h1 key={index} className="text-2xl font-bold mt-6 mb-3">{content}</h1>;
                      case 2: return <h2 key={index} className="text-xl font-bold mt-5 mb-2">{content}</h2>;
                      case 3: return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{content}</h3>;
                      case 4: return <h4 key={index} className="text-base font-bold mt-3 mb-1">{content}</h4>;
                      default: return <h5 key={index} className="text-sm font-bold mt-2 mb-1">{content}</h5>;
                    }
                  } 
                  // 处理无序列表
                  else if (line.match(/^[\-\*]\s+.+/)) {
                    return <li key={index} className="ml-4 mb-1">{processInlineMarkdown(line.replace(/^[\-\*]\s+/, ''))}</li>;
                  } 
                  // 处理有序列表
                  else if (line.match(/^\d+\.\s+.+/)) {
                    return <li key={index} className="ml-4 list-decimal mb-1">{processInlineMarkdown(line.replace(/^\d+\.\s+/, ''))}</li>;
                  } 
                  // 空行
                  else if (line.trim() === '') {
                    return <br key={index} />;
                  } 
                  // 普通段落
                  else {
                    return <p key={index} className="mb-2">{processInlineMarkdown(line)}</p>;
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">处理结果</h3>
            {result.answer && result.answer.trim() && (
              <div className="flex space-x-2">
                <button
                  onClick={handleDownload}
                  className="py-1 px-3 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none flex items-center"
                >
                  下载TXT
                </button>
                <button
                  onClick={handleDownloadWord}
                  className="py-1 px-3 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none flex items-center"
                >
                  下载Word
                </button>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50 rounded-md max-h-[500px] overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              {result.answer && result.answer.trim() ? (
                <div className="formatted-result">
                  {result.answer.split('\n').map((line: string, index: number) => {
                    // 处理标题 - 增强型匹配，处理多种格式的标题
                    if (line.match(/^#+\s+.+/)) {
                      const level = line.match(/^(#+)/)?.[0].length || 1;
                      const content = line.replace(/^#+\s+/, '');
                      
                      switch(level) {
                        case 1: return <h1 key={index} className="text-2xl font-bold mt-6 mb-3">{content}</h1>;
                        case 2: return <h2 key={index} className="text-xl font-bold mt-5 mb-2">{content}</h2>;
                        case 3: return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{content}</h3>;
                        case 4: return <h4 key={index} className="text-base font-bold mt-3 mb-1">{content}</h4>;
                        default: return <h5 key={index} className="text-sm font-bold mt-2 mb-1">{content}</h5>;
                      }
                    } 
                    // 处理无序列表
                    else if (line.match(/^[\-\*]\s+.+/)) {
                      return <li key={index} className="ml-4 mb-1">{processInlineMarkdown(line.replace(/^[\-\*]\s+/, ''))}</li>;
                    } 
                    // 处理有序列表
                    else if (line.match(/^\d+\.\s+.+/)) {
                      return <li key={index} className="ml-4 list-decimal mb-1">{processInlineMarkdown(line.replace(/^\d+\.\s+/, ''))}</li>;
                    } 
                    // 空行
                    else if (line.trim() === '') {
                      return <br key={index} />;
                    } 
                    // 普通段落
                    else {
                      return <p key={index} className="mb-2">{processInlineMarkdown(line)}</p>;
                    }
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>没有显示结果内容，请检查API返回格式。</p>
                  <p className="text-xs mt-2 text-gray-400">如需帮助，请开启调试模式查看详情。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {debugMode && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-800">调试信息</h3>
            <button 
              onClick={toggleDebugMode}
              className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              关闭调试模式
            </button>
          </div>
          <div className="bg-gray-700 text-green-300 p-3 rounded overflow-x-auto text-xs font-mono">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 