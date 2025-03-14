'use client';

import Link from 'next/link';
import { ArrowRightIcon } from './components/Icons';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 英雄区域 */}
      <div className="py-16 md:py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            AI驱动的设计研究
          </span>
          <br />智能体平台
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          从研究到视觉化，一站式AI设计助手，帮助创意工作者加速设计流程，激发创意灵感
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/design-research" 
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            开始设计研究
          </Link>
          <Link 
            href="/concept-image" 
            className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            探索概念图生成
          </Link>
        </div>
      </div>

      {/* 功能卡片区域 */}
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-16">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="h-2 bg-blue-600"></div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">设计主题研究</h3>
              <p className="text-gray-600 mb-4">基于AI生成详尽的设计研究报告，包含背景、趋势、洞察和关键点分析</p>
              <Link 
                href="/design-research" 
                className="text-blue-600 hover:text-blue-800 inline-flex items-center group font-medium"
              >
                开始研究
                <ArrowRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="h-2 bg-purple-600"></div>
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">概念图生成</h3>
              <p className="text-gray-600 mb-4">从研究内容中提取关键概念，自动生成相关的设计概念图和视觉表达</p>
              <Link 
                href="/concept-image" 
                className="text-purple-600 hover:text-purple-800 inline-flex items-center group font-medium"
              >
                生成概念图
                <ArrowRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="h-2 bg-indigo-600"></div>
            <div className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">平面效果</h3>
              <p className="text-gray-600 mb-4">将图片转换为现代扁平化设计风格，适用于图标、插画和界面设计</p>
              <Link 
                href="/flat-effect" 
                className="text-indigo-600 hover:text-indigo-800 inline-flex items-center group font-medium"
              >
                创建平面效果
                <ArrowRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="h-2 bg-blue-600"></div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3D效果</h3>
              <p className="text-gray-600 mb-4">为平面图像增添立体感和空间感，创造引人注目的三维视觉效果</p>
              <Link 
                href="/3d-effect" 
                className="text-blue-600 hover:text-blue-800 inline-flex items-center group font-medium"
              >
                创建3D效果
                <ArrowRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="h-2 bg-purple-600"></div>
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">风格转换</h3>
              <p className="text-gray-600 mb-4">将普通图片转换为艺术风格作品，包括油画、水彩、素描等多种风格</p>
              <Link 
                href="/style-transfer" 
                className="text-purple-600 hover:text-purple-800 inline-flex items-center group font-medium"
              >
                探索风格转换
                <ArrowRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md">
            <div className="h-2 bg-green-600"></div>
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">板式输出</h3>
              <p className="text-gray-600 mb-4">生成专业的排版布局，提升内容可读性和美观度，适用于多种设计场景</p>
              <Link 
                href="/layout-output" 
                className="text-green-600 hover:text-green-800 inline-flex items-center group font-medium"
              >
                创建板式设计
                <ArrowRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 使用流程区域 */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl my-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">使用流程</h2>
          <p className="text-gray-600 text-center mb-16 text-lg max-w-3xl mx-auto">从研究到设计再到视觉输出，无缝衔接的智能化设计流程</p>
          
          <div className="relative">
            {/* 连接线 */}
            <div className="absolute left-[50%] top-12 h-[calc(100%-6rem)] w-px bg-gray-200 -z-10 hidden md:block"></div>

            <div className="space-y-16 md:space-y-24 relative">
              <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                <div className="text-center md:text-right order-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mb-4 md:ml-auto">1</div>
                  <h3 className="text-xl font-semibold mb-2">研究与探索</h3>
                  <p className="text-gray-600">在"设计主题研究"页面输入您感兴趣的主题，智能体将生成全面、深入的研究报告，为您提供背景知识、趋势分析和设计洞察</p>
                </div>
                <div className="hidden md:block order-2">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <svg className="w-full h-auto text-blue-600" viewBox="0 0 200 140" fill="none">
                      <rect width="200" height="140" rx="4" fill="currentColor" fillOpacity="0.1"/>
                      <rect x="20" y="20" width="160" height="16" rx="2" fill="currentColor" fillOpacity="0.3"/>
                      <rect x="20" y="48" width="120" height="8" rx="2" fill="currentColor" fillOpacity="0.2"/>
                      <rect x="20" y="64" width="160" height="56" rx="2" fill="currentColor" fillOpacity="0.15"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                <div className="hidden md:block order-2">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <svg className="w-full h-auto text-purple-600" viewBox="0 0 200 140" fill="none">
                      <rect width="200" height="140" rx="4" fill="currentColor" fillOpacity="0.1"/>
                      <circle cx="100" cy="70" r="40" fill="currentColor" fillOpacity="0.2"/>
                    </svg>
                  </div>
                </div>
                <div className="text-center md:text-left order-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-lg mb-4">2</div>
                  <h3 className="text-xl font-semibold mb-2">概念可视化</h3>
                  <p className="text-gray-600">前往"概念图生成"页面，基于研究内容自动提取关键概念，生成与主题相关的概念图，直观展示设计思路</p>
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                <div className="text-center md:text-right order-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg mb-4 md:ml-auto">3</div>
                  <h3 className="text-xl font-semibold mb-2">风格应用</h3>
                  <p className="text-gray-600">使用"平面效果"、"3D效果"和"风格转换"工具，为您的设计应用多种视觉风格，丰富表现形式</p>
                </div>
                <div className="hidden md:block order-2">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-3 gap-2">
                    <div className="h-20 bg-indigo-200 rounded-md"></div>
                    <div className="h-20 bg-blue-200 rounded-md"></div>
                    <div className="h-20 bg-purple-200 rounded-md"></div>
                  </div>
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                <div className="hidden md:block order-2">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <svg className="w-full h-auto text-green-600" viewBox="0 0 200 140" fill="none">
                      <rect width="200" height="140" rx="4" fill="currentColor" fillOpacity="0.1"/>
                      <rect x="20" y="20" width="50" height="100" rx="2" fill="currentColor" fillOpacity="0.2"/>
                      <rect x="80" y="20" width="100" height="45" rx="2" fill="currentColor" fillOpacity="0.15"/>
                      <rect x="80" y="75" width="100" height="45" rx="2" fill="currentColor" fillOpacity="0.15"/>
                    </svg>
                  </div>
                </div>
                <div className="text-center md:text-left order-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold text-lg mb-4">4</div>
                  <h3 className="text-xl font-semibold mb-2">输出成品</h3>
                  <p className="text-gray-600">利用"板式输出"和"演示动画"功能，将设计整合成完整的演示文稿或动态效果，提高传达效果</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA区域 */}
      <div className="py-16 my-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">准备好开始您的设计之旅了吗？</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            从研究到视觉输出，我们的AI智能体将帮助您更高效地完成设计流程
          </p>
          <Link 
            href="/design-research" 
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            立即开始
          </Link>
        </div>
      </div>
    </div>
  );
}

