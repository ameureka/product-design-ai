'use client';

import React, { useState } from 'react';

interface ImageGeneratorProps {
  researchText: string;
}

export default function ImageGenerator({ researchText }: ImageGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [source, setSource] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);

  const generateImage = async () => {
    if (!researchText.trim()) {
      setError('需要研究文本才能生成图片');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: researchText }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '图片生成失败');
      }

      setKeywords(data.keywords);
      setImage(data.imageUrl);
      setSource(data.source || 'MindJoury');
      setGenerationCount(prev => prev + 1);
    } catch (err) {
      setError((err as Error).message || '发生未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">概念图生成器</h2>
      
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <h3 className="text-md font-medium mb-2 text-purple-800">使用说明</h3>
        <p className="text-sm text-gray-600">
          本工具将分析您的研究内容，自动提取关键概念，并生成相关的设计概念图。
          点击下方按钮开始生成过程。
        </p>
      </div>

      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-2">研究内容摘要</h3>
        <div className="p-3 bg-gray-50 rounded-md max-h-40 overflow-y-auto text-sm text-gray-700">
          {researchText.length > 300 
            ? `${researchText.substring(0, 300)}...` 
            : researchText}
        </div>
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <button
          onClick={generateImage}
          disabled={isLoading || !researchText.trim()}
          className="py-3 px-8 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-purple-300 transition-all duration-200 transform hover:scale-105"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              生成概念图中...
            </span>
          ) : (
            generationCount > 0 ? '重新生成概念图' : '生成概念图'
          )}
        </button>
        {generationCount > 0 && (
          <p className="text-xs text-gray-500 mt-2">已生成 {generationCount} 次</p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {keywords && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">提取的关键概念:</h3>
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex flex-wrap gap-2">
              {keywords.split(',').map((keyword, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {image && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">生成的概念图{source && ` (由${source}提供)`}:</h3>
          <div className="flex justify-center">
            <div className="relative w-full max-w-lg overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
              <img 
                src={image} 
                alt="基于研究生成的概念图" 
                className="rounded-lg w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 right-3">
                  <a 
                    href={image} 
                    download="concept-image.jpg"
                    className="px-3 py-1 bg-white/80 text-gray-800 rounded text-xs font-medium hover:bg-white"
                  >
                    下载图片
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 