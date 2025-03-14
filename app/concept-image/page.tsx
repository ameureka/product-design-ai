'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageGenerator from '../components/ImageGenerator';

export default function ConceptImage() {
  const [researchText, setResearchText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 从localStorage获取研究内容
    const savedResearch = localStorage.getItem('researchText');
    if (savedResearch) {
      setResearchText(savedResearch);
    }
    setLoaded(true);
  }, []);

  const handleCreateResearch = () => {
    router.push('/design-research');
  };

  if (!loaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-2 text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">概念图生成</h1>
        <p className="mt-2 text-lg text-gray-600">
          将研究内容转化为精美的设计概念图
        </p>
      </div>

      {researchText ? (
        <ImageGenerator researchText={researchText} />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-xl mx-auto text-center">
          <svg 
            className="h-16 w-16 text-yellow-500 mx-auto mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-900 mb-2">未找到研究内容</h2>
          <p className="text-gray-600 mb-6">
            请先在设计主题研究页面生成研究内容，然后再生成概念图。
          </p>
          <button
            onClick={handleCreateResearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            前往研究页面
          </button>
        </div>
      )}
    </div>
  );
} 