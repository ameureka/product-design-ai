'use client';

import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

export default function DebugPage() {
  const [apiUrl, setApiUrl] = useState<string>('https://api.dify.ai/v1/workflows/run');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyType, setApiKeyType] = useState<string>('workflow');
  const [inputs, setInputs] = useState<Record<string, string>>({
    title: '自主巡航配送机器人设计研究',
    topic: '自主巡航配送机器人设计',
    requirements: '城市环境中的自主配送机器人，需要考虑安全性、导航能力和用户体验',
  });
  const [responseMode, setResponseMode] = useState<string>('blocking');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [requestDuration, setRequestDuration] = useState<number | null>(null);
  const [useProxy, setUseProxy] = useState(true);

  // 从localStorage加载API密钥
  useEffect(() => {
    const savedApiKey = localStorage.getItem('dify_api_key_001_workflow');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    // 加载API密钥类型
    const savedApiKeyType = localStorage.getItem('dify_api_key_type');
    if (savedApiKeyType) {
      setApiKeyType(savedApiKeyType);
    }
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    localStorage.setItem('dify_api_key_001_workflow', value);
  };

  const handleApiKeyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setApiKeyType(value);
    localStorage.setItem('dify_api_key_type', value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);
    setRequestDuration(null);
    
    const startTime = Date.now();
    addLog(`开始请求 - 模式: ${responseMode}, URL: ${useProxy ? '/api/dify' : apiUrl}`);
    addLog(`请求参数: ${JSON.stringify(inputs, null, 2)}`);
    addLog(`使用API密钥类型: ${apiKeyType}`);

    try {
      // 设置请求选项
      const url = useProxy ? '/api/dify' : apiUrl;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // 如果直接调用Dify API，添加Authorization头
      if (!useProxy) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
      
      const requestBody = useProxy 
        ? { 
            inputs, 
            responseMode,
            keyType: apiKeyType // 传递API密钥类型给后端
          } 
        : {
            inputs,
            response_mode: responseMode,
            user: 'debug-tool'
          };
          
      addLog(`请求头: ${JSON.stringify(headers, null, 2)}`);
      addLog(`请求体: ${JSON.stringify(requestBody, null, 2)}`);
      
      // 发送请求
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      const duration = Date.now() - startTime;
      setRequestDuration(duration);
      addLog(`收到响应 - 状态: ${response.status}, 耗时: ${duration}ms`);

      if (!response.ok) {
        let errorMessage = `API responded with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          addLog(`错误详情: ${JSON.stringify(errorData, null, 2)}`);
        } catch (e) {
          const errorText = await response.text();
          errorMessage += `: ${errorText}`;
          addLog(`错误文本: ${errorText}`);
        }
        throw new Error(errorMessage);
      }

      // 处理响应数据
      if (responseMode === 'streaming') {
        // 处理流式响应
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('无法读取响应流');
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            addLog('流式响应结束');
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          // 处理数据行
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.slice(5).trim();
              addLog(`接收到数据: ${data.substring(0, 50)}${data.length > 50 ? '...' : ''}`);
              
              if (data === '[DONE]') {
                addLog('流式响应完成标记');
              } else {
                try {
                  const parsedData = JSON.parse(data);
                  if (parsedData.answer) {
                    fullText += parsedData.answer;
                  }
                } catch (e) {
                  addLog(`解析错误: ${(e as Error).message}`);
                }
              }
            }
          }
        }
        
        setResult({ answer: fullText });
        addLog(`设置结果 - 长度: ${fullText.length}`);
      } else {
        // 处理标准响应
        const data = await response.json();
        setResult(data);
        addLog(`设置结果 - 类型: ${typeof data}, 大小: ${JSON.stringify(data).length}`);
      }
    } catch (err) {
      setError((err as Error).message);
      addLog(`请求错误: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
      const finalDuration = Date.now() - startTime;
      setRequestDuration(finalDuration);
      addLog(`请求结束 - 总耗时: ${finalDuration}ms`);
    }
  };

  const handleSaveResult = () => {
    if (!result?.answer) return;
    
    const blob = new Blob([result.answer], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `dify-result-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`);
    addLog('结果已保存为文本文件');
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dify API 调试工具</h1>
        <p className="mt-2 text-gray-600">用于测试和调试Dify.ai工作流API的工具</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">请求配置</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <span>API端点:</span>
                <select 
                  value={useProxy ? 'proxy' : 'direct'} 
                  onChange={(e) => setUseProxy(e.target.value === 'proxy')}
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="proxy">使用代理 (/api/dify)</option>
                  <option value="direct">直接调用 (需API密钥)</option>
                </select>
              </label>
              
              {!useProxy && (
                <>
                  <input 
                    type="text" 
                    value={apiUrl} 
                    onChange={(e) => setApiUrl(e.target.value)} 
                    placeholder="Dify API URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API密钥类型
                    </label>
                    <select 
                      value={apiKeyType} 
                      onChange={handleApiKeyTypeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="workflow">工作流密钥</option>
                      <option value="api">API密钥</option>
                    </select>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API密钥
                    </label>
                    <input 
                      type="text" 
                      value={apiKey} 
                      onChange={handleApiKeyChange} 
                      placeholder="Dify API Key" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                响应模式
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    value="blocking" 
                    checked={responseMode === 'blocking'} 
                    onChange={() => setResponseMode('blocking')} 
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">阻塞模式</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    value="streaming" 
                    checked={responseMode === 'streaming'} 
                    onChange={() => setResponseMode('streaming')} 
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">流式模式</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                研究标题
              </label>
              <input 
                type="text" 
                value={inputs.title} 
                onChange={(e) => handleInputChange('title', e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                研究主题
              </label>
              <input 
                type="text" 
                value={inputs.topic} 
                onChange={(e) => handleInputChange('topic', e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                需求描述
              </label>
              <textarea 
                value={inputs.requirements} 
                onChange={(e) => handleInputChange('requirements', e.target.value)} 
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isLoading ? '处理中...' : '发送请求'}
            </button>
          </form>
        </div>
        
        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">日志输出</h2>
              <button 
                onClick={handleClearLogs}
                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                清除日志
              </button>
            </div>
            <div className="h-60 overflow-y-auto bg-gray-100 p-3 rounded-md text-xs font-mono">
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <div key={i} className="pb-1 border-b border-gray-200 mb-1 last:border-0">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">暂无日志...</div>
              )}
            </div>
            
            {requestDuration !== null && (
              <div className="mt-2 text-sm text-gray-600">
                请求耗时: <span className="font-semibold">{requestDuration}ms</span>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">响应结果</h2>
              {result?.answer && (
                <button 
                  onClick={handleSaveResult}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  保存结果
                </button>
              )}
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
                {error}
              </div>
            )}
            
            {result ? (
              result.answer ? (
                <div className="max-h-80 overflow-y-auto bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap">{result.answer}</pre>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 text-sm rounded-md">
                  <pre className="whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )
            ) : (
              <div className="text-gray-500 italic text-center py-10">
                {isLoading ? '加载中...' : '暂无结果'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <a 
          href="/design-research" 
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          返回研究页面
        </a>
        <p className="mt-4">© {new Date().getFullYear()} DeepResearch AI. 本工具仅用于开发调试。</p>
      </div>
    </div>
  );
} 