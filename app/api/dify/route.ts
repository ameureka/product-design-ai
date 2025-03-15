import { NextResponse } from 'next/server';

// 调试辅助函数
function formatDebugInfo(data: any): string {
  try {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  } catch (e) {
    return `[无法格式化: ${e}]`;
  }
}

// Dify.ai API配置
const DIFY_API_URL = 'https://api.dify.ai/v1';

// 获取正确的API密钥函数，支持不同类型的密钥
function getApiKey(keyType: string = 'workflow'): string {
  // 当前支持的密钥类型及其对应的环境变量
  const keyMap: Record<string, string> = {
    'workflow': process.env.DIFY_API_KEY_001_workflow || 'app-FMxzRKL7AgD1Jp7J5CKkjNI1',
    'api': process.env.DIFY_API_KEY_API || '',
    'chat': process.env.DIFY_API_KEY_CHAT || '',
    'completion': process.env.DIFY_API_KEY_COMPLETION || '',
  };
  
  // 返回指定类型的密钥，如果不存在则使用默认的工作流密钥
  return keyMap[keyType] || keyMap['workflow'];
}

// 为调试提供的测试端点
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const debug = searchParams.get('debug') === 'true';
  const keyType = searchParams.get('keyType') || 'workflow';
  
  const API_KEY = getApiKey(keyType);
  
  // 返回API状态和配置信息
  return NextResponse.json({
    status: 'ok',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    config: {
      api_url: DIFY_API_URL,
      api_key_type: keyType,
      // 不返回完整API密钥，只显示前几位和后几位
      api_key_preview: API_KEY ? `${API_KEY.substring(0, 4)}...${API_KEY.substring(API_KEY.length - 4)}` : 'not set',
    },
    debug_mode: debug,
    message: '调试端点正常工作',
    note: '这是一个仅用于调试的端点，用于测试API配置是否正确'
  });
}

export async function POST(request: Request) {
  const requestStartTime = Date.now();
  let debugMode = false;
  
  // 获取请求数据
  const requestData = await request.clone().text();
  
  try {
    // 解析请求JSON
    const { inputs, responseMode = 'blocking', debug = false, keyType = 'workflow' } = await request.json();
    debugMode = debug === true;
    
    // 获取对应类型的API密钥
    const API_KEY = getApiKey(keyType);
    
    // 调试日志 - 仅在调试模式下输出详细信息
    if (debugMode) {
      console.log('================ DIFY API 请求开始 (调试模式) ================');
      console.log('请求URL:', request.url);
      console.log('请求方法:', request.method);
      console.log('请求头:', Object.fromEntries([...request.headers.entries()]));
      console.log('请求体原始数据:', requestData);
      console.log('使用API密钥类型:', keyType);
    } else {
      console.log('================ DIFY API 请求开始 ================');
    }
    
    console.log('Dify API请求参数:', JSON.stringify({ inputs, responseMode, debug: debugMode, keyType }, null, 2));
    
    // 确保title字段存在，如果不存在则使用topic作为title
    let processedInputs = { ...inputs };
    if (!processedInputs.title && processedInputs.topic) {
      processedInputs.title = `${processedInputs.topic}研究`;
      console.log('自动生成title:', processedInputs.title);
    }

    // 构建请求体
    const requestBody = {
      inputs: processedInputs,
      response_mode: responseMode,
      user: 'AmerlinGPT'
    };
    
    console.log('发送到Dify的请求体:', JSON.stringify(requestBody, null, 2));

    // 向Dify.ai发送工作流执行请求
    const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Dify API响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Dify API错误: ${response.status}`, errorText);
      
      // 尝试解析错误内容
      let errorDetail = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetail = errorJson.message || errorText;
        console.error('解析后的错误详情:', errorJson);
        
        // 特别处理工作流未发布的情况
        if (errorJson.code === 'workflow_not_published') {
          errorDetail = '没有已发布的工作流，请先在Dify平台上创建并发布工作流。';
        }
      } catch (e) {
        // 解析失败，使用原始错误文本
        console.error('无法解析错误JSON:', e);
      }
      
      console.log(`================ DIFY API 请求结束 (${Date.now() - requestStartTime}ms) ================`);
      return NextResponse.json(
        { 
          error: `Dify API responded with status ${response.status}: ${errorDetail}`,
          debug: debugMode ? {
            request_time: requestStartTime,
            response_time: Date.now(),
            duration_ms: Date.now() - requestStartTime,
            error_text: errorText
          } : undefined
        },
        { status: response.status }
      );
    }

    // 如果是流式响应模式，直接传递流
    if (responseMode === 'streaming') {
      console.log('使用流式响应模式');
      // 转发流式响应
      const transformedStream = new TransformStream();
      const writer = transformedStream.writable.getWriter();
      
      // 转发原始响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }
      
      // 处理流
      (async () => {
        try {
          console.log('开始处理流式响应');
          let lineCount = 0;
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log('流式响应完成');
              break;
            }
            
            // 记录部分流数据
            lineCount++;
            if (lineCount % 5 === 0 || debugMode) {
              console.log(`已处理${lineCount}个数据块`);
              if (debugMode && value) {
                // 在调试模式下记录更详细的流数据
                const textChunk = new TextDecoder().decode(value);
                console.log(`数据块 #${lineCount} 内容:`, textChunk.substring(0, 100) + (textChunk.length > 100 ? '...' : ''));
              }
            }
            
            // 转发数据
            await writer.write(value);
          }
        } catch (e) {
          console.error('流处理错误:', e);
          
          // 发送错误消息到客户端
          const errorMsg = `data: ${JSON.stringify({
            error: '流处理错误: ' + (e as Error).message,
            answer: '生成过程中发生错误，请重试。',
            debug: debugMode ? {
              error_time: Date.now(),
              error_message: (e as Error).message,
              stack: (e as Error).stack
            } : undefined
          })}\n\n`;
          
          try {
            await writer.write(new TextEncoder().encode(errorMsg));
            await writer.write(new TextEncoder().encode('data: [DONE]\n\n'));
          } catch (writeError) {
            console.error('错误信息写入失败:', writeError);
          }
        } finally {
          writer.close();
          console.log(`================ DIFY API 流式请求结束 (${Date.now() - requestStartTime}ms) ================`);
        }
      })();
      
      return new Response(transformedStream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    }

    // 非流式响应则返回JSON
    const data = await response.json();
    
    if (debugMode) {
      console.log('Dify API响应完整数据:', formatDebugInfo(data));
    } else {
      console.log('Dify API响应数据摘要:', {
        has_answer: !!data.answer,
        answer_length: data.answer ? data.answer.length : 0,
        metadata: data.metadata
      });
    }
    
    // 检查返回数据格式并规范化
    let processedData = { ...data };
    let extractedContent = null;
    
    // 针对Dify工作流返回的数据结构进行深度处理
    // 先尝试检查常见的嵌套结构
    if (data.data?.outputs?.output) {
      // 最常见的Dify工作流返回格式
      extractedContent = data.data.outputs.output;
      console.log('从data.outputs.output提取内容');
    } else if (data.outputs?.output) {
      // 次常见的格式
      extractedContent = data.outputs.output;
      console.log('从outputs.output提取内容');
    } else if (data.data?.status === 'succeeded' && data.data?.outputs?.output) {
      // 另一种可能的格式
      extractedContent = data.data.outputs.output;
      console.log('从succeeded状态的outputs.output提取内容');
    } else if (typeof data.output === 'string') {
      // 直接输出字段
      extractedContent = data.output;
      console.log('从output字段提取内容');
    } else if (data.answer) {
      // 已有answer字段
      extractedContent = data.answer;
      console.log('使用已有answer字段');
    }
    
    // 如果上面的常见结构都不匹配，尝试递归查找可能包含内容的字段
    if (!extractedContent) {
      // 定义一个递归函数来搜索可能的内容字段
      const findContentField = (obj: any, depth: number = 0): string | null => {
        if (depth > 5) return null; // 防止无限递归
        if (!obj || typeof obj !== 'object') return null;
        
        // 检查常见内容字段名
        const possibleFields = ['output', 'answer', 'content', 'text', 'result', 'message', 'response'];
        for (const field of possibleFields) {
          if (obj[field] && typeof obj[field] === 'string' && obj[field].length > 50) {
            console.log(`在深度${depth}找到可能的内容字段: ${field}`);
            return obj[field];
          }
        }
        
        // 递归检查嵌套对象
        for (const key in obj) {
          if (typeof obj[key] === 'object') {
            const found = findContentField(obj[key], depth + 1);
            if (found) return found;
          }
        }
        
        return null;
      };
      
      extractedContent = findContentField(data);
      if (extractedContent) {
        console.log('通过递归搜索找到内容');
      }
    }
    
    // 如果仍然没找到内容，则使用整个响应JSON，但做特殊标记
    if (!extractedContent) {
      console.warn('无法从响应中提取文本内容');
      // 去除可能的包装字段，尝试取最大文本内容
      if (data.data && Object.keys(data.data).length > 0) {
        processedData = { answer: JSON.stringify(data.data, null, 2) };
      } else {
        processedData = { answer: JSON.stringify(data, null, 2) };
      }
    } else {
      // 使用提取的内容
      processedData = { answer: extractedContent };
    }
    
    // 添加调试信息
    if (debugMode) {
      processedData.debug = {
        request_time: requestStartTime,
        response_time: Date.now(),
        duration_ms: Date.now() - requestStartTime,
        extraction_path: extractedContent ? '提取成功' : '无法提取内容',
        content_length: processedData.answer?.length || 0,
        original_data_summary: {
          keys: Object.keys(data),
          has_data: !!data.data,
          has_outputs: !!data.outputs || !!data.data?.outputs,
          has_answer: !!data.answer,
          response_structure: JSON.stringify(
            // 创建一个结构概要，但不包含实际内容
            Object.keys(data).reduce((acc: Record<string, any>, key: string) => {
              if (typeof data[key] === 'object') {
                acc[key] = Object.keys(data[key] || {});
              } else if (typeof data[key] === 'string') {
                acc[key] = `[字符串，长度: ${data[key].length}]`;
              } else {
                acc[key] = typeof data[key];
              }
              return acc;
            }, {}),
            null,
            2
          )
        }
      };
    }
    
    console.log(`提取的内容长度: ${processedData.answer?.length || 0}`);
    console.log(`================ DIFY API 请求结束 (${Date.now() - requestStartTime}ms) ================`);
    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Dify API调用错误:', error);
    console.log(`================ DIFY API 请求异常结束 (${Date.now() - requestStartTime}ms) ================`);
    return NextResponse.json(
      { 
        error: '处理Dify请求时发生错误', 
        message: (error as Error).message,
        debug: debugMode ? {
          request_time: requestStartTime,
          error_time: Date.now(),
          duration_ms: Date.now() - requestStartTime,
          stack: (error as Error).stack,
          request_data: requestData
        } : undefined
      },
      { status: 500 }
    );
  }
} 