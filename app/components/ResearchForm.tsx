'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { convertToDocx } from '../utils/docxConverter';

interface ResearchFormProps {
  onResearchComplete: (research: string) => void;
}

export default function ResearchForm({ onResearchComplete }: ResearchFormProps) {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [research, setResearch] = useState('');
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('请输入研究主题');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '研究生成失败');
      }

      setResearch(data.research);
      onResearchComplete(data.research);
    } catch (err) {
      setError((err as Error).message || '发生未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!research) return;
    
    try {
      setIsDownloading(true);
      const blob = await convertToDocx(research, topic);
      saveAs(blob, `${topic}-设计研究报告.docx`);
    } catch (err) {
      setError('生成Word文档失败');
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const exampleTopics = [
    "自主巡航配送机器人设计",
    "家用服务机器人设计",
    "中医人工智能脉诊仪设计",
    "便携式蓝牙耳机设计"
  ];

  const handleExampleClick = (example: string) => {
    setTopic(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">设计主题研究生成器</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-md font-medium mb-2 text-blue-800">使用说明</h3>
        <p className="text-sm text-gray-600">
          输入您感兴趣的设计主题，系统将自动生成一份深入的研究报告，帮助您快速了解该领域的背景、趋势和关键点。
          生成的报告可以下载为Word文档，方便您进一步编辑和使用。
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            研究主题
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="冰淇淋k歌麦克风"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">示例主题：</span>
          {exampleTopics.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              {example}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-300 transition-all duration-200"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              生成研究中...
            </span>
          ) : '生成设计研究报告'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {research && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">研究结果</h3>
            <button
              onClick={handleDownloadWord}
              disabled={isDownloading}
              className="py-1 px-3 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none flex items-center"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </>
              ) : '下载Word文档'}
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-md max-h-[500px] overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm">{research}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 