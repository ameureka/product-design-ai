'use client';

import React, { useState, useRef } from 'react';

interface ImageProcessorProps {
  title: string;
  description: string;
  processType: string;
  buttonText: string;
  buttonColor: string;
  presets?: { name: string; description: string }[];
}

export default function ImageProcessor({
  title,
  description,
  processType,
  buttonText,
  buttonColor,
  presets = []
}: ImageProcessorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError('');

    try {
      // 在实际应用中，这里应该调用API处理图像
      // 现在我们模拟处理过程，返回原始图像
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟处理后的图像（实际应用中应该从API获取）
      setProcessedImage(selectedImage);
    } catch (err) {
      setError('处理图像时出错');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="text-md font-medium mb-2 text-gray-800">使用说明</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="mb-6">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={triggerFileInput}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          
          {selectedImage ? (
            <div>
              <img 
                src={selectedImage} 
                alt="已选择的图片" 
                className="max-h-64 mx-auto mb-4 rounded-md"
              />
              <p className="text-sm text-gray-500">点击或拖放更换图片</p>
            </div>
          ) : (
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">点击上传或拖放图片到此处</p>
              <p className="mt-1 text-xs text-gray-500">支持 JPG, PNG, GIF 格式</p>
            </div>
          )}
        </div>
      </div>

      {presets.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-3 text-gray-800">选择预设风格</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {presets.map((preset, index) => (
              <div 
                key={index}
                onClick={() => handlePresetChange(preset.name)}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedPreset === preset.name 
                    ? `bg-${buttonColor}-50 border-${buttonColor}-200` 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <h4 className="font-medium text-sm">{preset.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <button
          onClick={processImage}
          disabled={!selectedImage || isLoading}
          className={`py-2 px-6 bg-${buttonColor}-600 text-white font-semibold rounded-md hover:bg-${buttonColor}-700 focus:outline-none focus:ring-2 focus:ring-${buttonColor}-500 focus:ring-opacity-50 disabled:bg-${buttonColor}-300 transition-all duration-200`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              处理中...
            </span>
          ) : buttonText}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {processedImage && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">处理结果</h3>
          <div className="flex justify-center">
            <div className="relative max-w-lg overflow-hidden rounded-lg shadow-lg">
              <img 
                src={processedImage} 
                alt="处理后的图片" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 right-3">
                  <a 
                    href={processedImage} 
                    download={`${processType}-result.jpg`}
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