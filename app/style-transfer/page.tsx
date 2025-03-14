'use client';

import React from 'react';
import ImageProcessor from '../components/ImageProcessor';

export default function StyleTransfer() {
  const styleTransferPresets = [
    { name: '油画风格', description: '将图片转换为油画艺术风格' },
    { name: '水彩画', description: '柔和的水彩画效果' },
    { name: '素描风格', description: '黑白素描艺术效果' },
    { name: '波普艺术', description: '鲜艳的波普艺术风格' },
    { name: '印象派', description: '印象派绘画风格' },
    { name: '赛博朋克', description: '未来科技感的赛博朋克风格' },
    { name: '日式浮世绘', description: '传统日本浮世绘风格' },
    { name: '中国水墨', description: '传统中国水墨画风格' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">风格转换</h1>
        <p className="mt-2 text-lg text-gray-600">
          将您的图片转换为各种艺术风格
        </p>
      </div>

      <ImageProcessor 
        title="风格转换生成器"
        description="上传一张图片，选择您喜欢的艺术风格，我们将使用AI技术将您的图片转换为该风格的艺术作品。风格转换可以让普通照片变成独特的艺术品，为您的设计增添艺术气息。"
        processType="style"
        buttonText="转换风格"
        buttonColor="purple"
        presets={styleTransferPresets}
      />
    </div>
  );
} 