'use client';

import { useState, useEffect } from 'react';
import DifyWorkflowProcessor from '../components/DifyWorkflowProcessor';

export default function DesignResearch() {
  const [research, setResearch] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [debugLogsVisible, setDebugLogsVisible] = useState(false);
  const [debugLogs, setDebugLogs] = useState<any[]>([]);

  // 从URL参数中获取debug模式设置
  useEffect(() => {
    // 检查localStorage中的debug模式设置
    const savedDebugMode = localStorage.getItem('designResearchDebugMode');
    
    // 优先检查URL参数
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('debug') === 'true') {
      setDebugMode(true);
    } else if (savedDebugMode === 'true') {
      // 如果URL没有设置，但localStorage有设置，则使用localStorage的值
      setDebugMode(true);
      // 更新URL以保持一致
      const url = new URL(window.location.href);
      url.searchParams.set('debug', 'true');
      window.history.replaceState({}, '', url);
    }
    
    // 监听来自DifyWorkflowProcessor的调试模式切换事件
    const handleToggleDebugMode = () => {
      toggleDebugMode();
    };
    
    document.addEventListener('toggleDebugMode', handleToggleDebugMode);
    
    // 清理事件监听器
    return () => {
      document.removeEventListener('toggleDebugMode', handleToggleDebugMode);
    };
  }, []);

  // 记录调试日志的函数
  const addDebugLog = (action: string, data: any) => {
    if (debugMode) {
      const timestamp = new Date().toISOString();
      setDebugLogs(prev => [...prev, { timestamp, action, data }]);
    }
  };

  // 清除调试日志
  const clearDebugLogs = () => {
    setDebugLogs([]);
    addDebugLog('logs_cleared', { message: '调试日志已清除' });
  };

  const handleResearchComplete = (result: any) => {
    if (result.answer) {
      setResearch(result.answer);
      
      // 如果需要，这里可以添加保存研究内容到localStorage或其他存储的代码
      localStorage.setItem('researchText', result.answer);
      
      // 添加调试日志
      addDebugLog('research_complete', { 
        success: true, 
        length: result.answer.length,
        preview: result.answer.substring(0, 100) + '...' 
      });
      
      // 显示成功消息
      alert('研究报告生成成功！您可以查看结果并下载Word或文本格式的文档。');
    }
  };

  const toggleDebugMode = () => {
    const newDebugMode = !debugMode;
    setDebugMode(newDebugMode);
    
    // 保存到localStorage
    localStorage.setItem('designResearchDebugMode', newDebugMode.toString());
    
    // 更新URL参数
    const url = new URL(window.location.href);
    if (newDebugMode) {
      url.searchParams.set('debug', 'true');
    } else {
      url.searchParams.delete('debug');
    }
    window.history.pushState({}, '', url);
    
    // 添加调试日志
    addDebugLog('debug_mode_toggled', { enabled: newDebugMode });
  };

  const researchInputFields = [
    {
      id: 'title',
      label: '研究标题',
      placeholder: '请输入研究标题，例如：自主巡航配送机器人设计研究',
    },
    {
      id: 'topic',
      label: '研究主题',
      placeholder: '请输入研究主题，例如：自主巡航配送机器人设计',
    },
    {
      id: 'requirements',
      label: '需求描述',
      placeholder: '详细描述您的研究需求、关注点和期望，例如：需要考虑城市环境中的安全性、导航能力和用户体验',
      type: 'textarea'
    }
  ];
  
  const researchPresets = [
    {
      name: '自主巡航配送机器人设计',
      values: {
        title: '自主巡航配送机器人设计研究',
        topic: '自主巡航配送机器人设计',
        requirements: '需要考虑城市环境中的安全性、导航能力和用户体验'
      }
    },
    {
      name: '家用服务机器人设计',
      values: {
        title: '家用服务机器人设计研究',
        topic: '家用服务机器人设计',
        requirements: '面向家庭环境的多功能服务机器人，需考虑安全性、实用性和交互体验'
      }
    },
    {
      name: '中医人工智能脉诊仪设计',
      values: {
        title: '中医人工智能脉诊仪设计研究',
        topic: '中医人工智能脉诊仪设计',
        requirements: '结合传统中医理论与现代传感技术的智能诊断设备设计'
      }
    },
    {
      name: '便携式蓝牙耳机设计',
      values: {
        title: '便携式蓝牙耳机设计研究',
        topic: '便携式蓝牙耳机设计',
        requirements: '轻便、长续航、高音质的生活方式蓝牙耳机产品设计'
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">深度设计研究</h1>
        <p className="mt-2 text-lg text-gray-600">
          获取详细的设计主题研究报告，深入了解趋势与洞见
        </p>
        
        {/* 调试模式切换按钮 */}
        <div className="mt-2 flex justify-center space-x-2">
          <button
            onClick={toggleDebugMode}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              debugMode 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {debugMode ? '🐞 调试模式已开启' : '⚙️ 开启调试模式'}
          </button>
          
          {debugMode && (
            <button
              onClick={() => setDebugLogsVisible(!debugLogsVisible)}
              className="text-xs px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              {debugLogsVisible ? '隐藏日志' : '显示日志'}
            </button>
          )}
          
          {debugMode && (
            <button
              onClick={clearDebugLogs}
              className="text-xs px-3 py-1 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              清除日志
            </button>
          )}
        </div>
        
        {debugMode && (
          <div className="mt-2 text-xs text-purple-600">
            调试模式已启用，页面将显示额外的技术信息
          </div>
        )}
        
        {/* 调试日志显示区域 */}
        {debugMode && debugLogsVisible && (
          <div className="mt-4 p-4 bg-gray-800 text-green-300 rounded-lg text-left overflow-auto max-h-60 text-xs font-mono">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-medium">调试日志</h4>
              <span className="text-gray-400">{debugLogs.length} 条记录</span>
            </div>
            {debugLogs.length === 0 ? (
              <div className="text-gray-400 text-center py-4">暂无日志记录</div>
            ) : (
              debugLogs.map((log, index) => (
                <div key={index} className="mb-2 pb-2 border-b border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-yellow-300">{log.action}</span>
                    <span className="text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <pre className="mt-1 text-2xs overflow-x-auto">{JSON.stringify(log.data, null, 2)}</pre>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">如何使用设计研究工具</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>在下方表单中填写<strong>研究标题</strong>、<strong>研究主题</strong>和<strong>需求描述</strong>（或选择预设配置）</li>
          <li>点击<strong>开始处理</strong>按钮启动研究生成流程</li>
          <li>等待系统自动生成研究报告（这可能需要几秒到几分钟时间）</li>
          <li>研究报告生成后，可以直接查看或下载为Word/TXT文档</li>
          <li>根据需要，您可以编辑下载的文档，或将内容复制到其他应用中使用</li>
        </ol>
      </div>

      <DifyWorkflowProcessor 
        title="设计主题研究生成器"
        description="输入您感兴趣的设计主题，系统将自动生成一份深入的研究报告，帮助您快速了解该领域的背景、趋势和关键点。生成的报告可以下载为Word或文本文档，方便您进一步编辑和使用。"
        inputFields={researchInputFields}
        presets={researchPresets}
        onProcessComplete={handleResearchComplete}
        debugMode={debugMode}
      />

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} DeepResearch AI. 本工具基于Dify.ai工作流技术。</p>
        {debugMode && <p className="mt-1 text-xs text-purple-500">调试版本 v1.0.2</p>}
      </div>
      
      {debugMode && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 mb-2">调试工具</h3>
          <div className="flex flex-wrap gap-2">
            <a 
              href="/debug" 
              target="_blank"
              className="text-xs px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700"
            >
              打开调试工具页面
            </a>
            <a 
              href={`/api/dify/test?${new URLSearchParams(Object.entries({ debug: 'true' }))}`}
              target="_blank"
              className="text-xs px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              测试Dify API
            </a>
            <button
              onClick={() => {
                localStorage.removeItem('researchText');
                addDebugLog('research_cleared', { message: '清除了本地保存的研究内容' });
                alert('已清除本地保存的研究内容');
              }}
              className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              清除本地研究缓存
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 