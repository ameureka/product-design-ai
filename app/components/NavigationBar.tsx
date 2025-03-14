'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function NavigationBar() {
  const pathname = usePathname();
  
  const navItems = [
    { path: '/', label: '首页' },
    { path: '/design-research', label: '设计主题研究' },
    { path: '/concept-image', label: '概念图生成' },
    { path: '/flat-effect', label: '平面效果' },
    { path: '/3d-effect', label: '3D效果' },
    { path: '/style-transfer', label: '风格转换' },
    { path: '/layout-output', label: '板式输出' },
    { path: '/demo-animation', label: '演示动画' },
  ];

  return (
    <nav className="sticky top-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md z-10 backdrop-blur-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center overflow-x-auto whitespace-nowrap">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Logo size={36} />
                <span className="text-xl font-bold text-blue-600">产品设计智能体</span>
              </Link>
            </div>
            <div className="ml-6 flex space-x-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`inline-flex items-center px-3 py-2 rounded-md transition-colors duration-200 
                    ${pathname === item.path 
                      ? 'bg-blue-100 text-blue-700 font-semibold' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 