'use client';

import React from 'react';
import ImageProcessor from '../components/ImageProcessor';

export default function DemoAnimation() {
  const animationPresets = [
    { name: '淡入淡出', description: '简单的淡入淡出过渡动画' },
    { name: '滑动切换', description: '平滑的滑动过渡效果' },
    { name: '缩放动画', description: '缩放放大的动态效果' },
    { name: '3D旋转', description: '3D空间中的旋转动画' },
    { name: '弹性动效', description: '带有弹性的动画效果' },
    { name: '粒子效果', description: '元素分解为粒子的动画效果' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">演示动画</h1>
        <p className="mt-2 text-lg text-gray-600">
          为您的设计添加生动的动画效果
        </p>
      </div>

      <ImageProcessor 
        title="演示动画生成器"
        description="上传一张图片或设计作品，选择您喜欢的动画效果，我们将为您生成简短的演示动画。动态效果可以使您的设计更加生动，提升用户体验和吸引力，特别适合产品展示和演示文稿。"
        processType="animation"
        buttonText="生成动画效果"
        buttonColor="rose"
        presets={animationPresets}
      />
    </div>
  );
} 