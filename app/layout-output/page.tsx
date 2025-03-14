'use client';

import React from 'react';
import ImageProcessor from '../components/ImageProcessor';

export default function LayoutOutput() {
  const layoutPresets = [
    { name: '海报布局', description: '适合宣传海报的版式设计' },
    { name: '杂志版式', description: '专业杂志风格的排版布局' },
    { name: '社交媒体', description: '适合社交媒体分享的版式' },
    { name: '简历模板', description: '专业简历的版式设计' },
    { name: '名片设计', description: '商务名片的版式布局' },
    { name: '宣传册', description: '多页宣传册的版式设计' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">板式输出</h1>
        <p className="mt-2 text-lg text-gray-600">
          将您的内容转换为专业的排版设计
        </p>
      </div>

      <ImageProcessor 
        title="板式设计生成器"
        description="上传一张图片或设计元素，选择您需要的版式类型，我们将为您生成专业的排版布局。良好的版式设计能够提升内容的可读性和美观度，使您的设计更具专业感。"
        processType="layout"
        buttonText="生成板式设计"
        buttonColor="green"
        presets={layoutPresets}
      />
    </div>
  );
} 