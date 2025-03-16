'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";

export default function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const navItems = [
    { path: '/design-research', label: '首页', isHome: true },
    { path: '/design-research', label: '主题研究', isHome: false },
    { path: '/concept-image', label: '概念推演' },
    { path: '/flat-effect', label: '二维设计' },
    { path: '/3d-effect', label: '3d设计' },
    { path: '/style-transfer', label: '风格转换' },
    { path: '/layout-output', label: '设计输出' },
    { path: '/demo-animation', label: '后期宣传' },
    { path: '/debug', label: '调试工具' },
  ];

  // 增加直接导航函数，避免链接依赖配置的重定向
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // 判断高亮逻辑：针对首页和主题研究特殊处理
  const isActiveLink = (item: any) => {
    if (pathname === '/design-research') {
      // 如果当前在设计研究页面，根据isHome属性决定高亮哪个
      return item.isHome === true ? true : false;
    }
    // 其他页面正常判断
    return pathname === item.path;
  };

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-10 backdrop-blur-sm bg-opacity-95 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center overflow-x-auto whitespace-nowrap">
            <div className="flex-shrink-0 flex items-center">
              <div 
                onClick={() => handleNavigation('/design-research')} 
                className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Logo size={36} />
                <span className="text-xl font-bold text-blue-600">产品设计智能体</span>
              </div>
            </div>
            <div className="ml-6 flex space-x-4">
              {navItems.map((item) => (
                <div
                  key={item.path + item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={`inline-flex items-center px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer
                    ${isActiveLink(item) 
                      ? 'text-red-500 font-semibold' 
                      : 'text-gray-700 hover:text-red-500'}`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 