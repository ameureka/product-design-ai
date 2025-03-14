'use client';

import React from 'react';
import ImageProcessor from '../components/ImageProcessor';

export default function FlatEffect() {
  const flatEffectPresets = [
    { name: '简约扁平', description: '简洁的扁平化设计风格' },
    { name: '渐变扁平', description: '带有渐变色彩的扁平效果' },
    { name: '长阴影', description: '带有长投影的扁平设计' },
    { name: '纸张质感', description: '模拟纸张材质的扁平效果' },
    { name: '几何图形', description: '使用几何形状的扁平设计' },
    { name: '插画风格', description: '扁平化的插画设计风格' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">平面效果</h1>
        <p className="mt-2 text-lg text-gray-600">
          将您的图片转换为现代扁平化设计风格
        </p>
      </div>

      <ImageProcessor 
        title="平面效果生成器"
        description="上传一张图片，选择您喜欢的扁平化风格，我们将为您生成精美的平面设计效果。平面设计风格简洁、现代，适合用于图标、插画和界面设计。"
        processType="flat"
        buttonText="生成平面效果"
        buttonColor="indigo"
        presets={flatEffectPresets}
      />
    </div>
  );
} 