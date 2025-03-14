'use client';

import { useState } from 'react';
import ResearchForm from '../components/ResearchForm';

export default function DesignResearch() {
  const [research, setResearch] = useState('');

  const handleResearchComplete = (researchText: string) => {
    setResearch(researchText);
    
    // 如果需要，这里可以添加保存研究内容到localStorage或其他存储的代码
    localStorage.setItem('researchText', researchText);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">设计主题研究</h1>
        <p className="mt-2 text-lg text-gray-600">
          获取详细的设计主题研究报告，深入了解趋势与洞见
        </p>
      </div>

      <ResearchForm onResearchComplete={handleResearchComplete} />
    </div>
  );
} 