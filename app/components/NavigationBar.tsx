'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function NavigationBar() {
  const pathname = usePathname();
  
  const navItems = [
    { path: '/', label: '首页' },
    { path: '/design-research', label: '主题研究' },
    { path: '/concept-image', label: '概念推演' },
    { path: '/flat-effect', label: '二维设计' },
    { path: '/3d-effect', label: '3d设计' },
    { path: '/style-transfer', label: '风格转换' },
    { path: '/layout-output', label: '设计输出' },
    { path: '/demo-animation', label: '后期宣传' },
  ];

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-10 backdrop-blur-sm bg-opacity-95 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center overflow-x-auto whitespace-nowrap">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Logo size={36} />
                <span className="text-xl font-bold text-blue-600">产品设计智能体</span>
              </Link>
            </div>
            <div className="ml-6 flex space-x-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`inline-flex items-center px-3 py-2 rounded-md transition-colors duration-200 
                    ${pathname === item.path 
                      ? 'text-red-500 font-semibold' 
                      : 'text-gray-700 hover:text-red-500'}`}
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