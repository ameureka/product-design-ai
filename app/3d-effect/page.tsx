'use client';

import React from 'react';
import ImageProcessor from '../components/ImageProcessor';

export default function ThreeDEffect() {
  const threeDEffectPresets = [
    { name: '立体浮雕', description: '将平面图像转换为立体浮雕效果' },
    { name: '等距3D', description: '等距视角的3D效果' },
    { name: '透视3D', description: '带有透视效果的3D转换' },
    { name: '金属质感', description: '带有金属光泽的3D效果' },
    { name: '玻璃质感', description: '透明玻璃材质的3D效果' },
    { name: '全息投影', description: '科技感的全息3D效果' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">3D效果</h1>
        <p className="mt-2 text-lg text-gray-600">
          将您的平面图像转换为令人惊叹的3D效果
        </p>
      </div>

      <ImageProcessor 
        title="3D效果生成器"
        description="上传一张图片，选择您喜欢的3D效果风格，我们将为您生成立体感强的三维效果。3D效果可以为您的设计增添深度和空间感，使图像更加生动和引人注目。"
        processType="3d"
        buttonText="生成3D效果"
        buttonColor="blue"
        presets={threeDEffectPresets}
      />
    </div>
  );
} 