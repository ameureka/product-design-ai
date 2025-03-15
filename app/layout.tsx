import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "./components/NavigationBar";
import { metadata } from "./metadata";
import type { Metadata } from "next";
import Logo from "./components/Logo";
import Link from "next/link";
import SocialIcons from "./components/SocialIcons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 flex flex-col`}
      >
        <NavigationBar />
        
        <main className="pt-6 pb-10 flex-grow">
          {children}
        </main>
        
        <footer className="bg-white border-t border-gray-200">
          {/* 上部分 - 链接和Logo */}
          <div className="max-w-7xl mx-auto pt-10 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Logo和介绍 */}
              <div className="md:col-span-1">
                <Link href="/design-research" className="flex items-center gap-2 mb-4">
                  <Logo size={30} variant="dark" />
                  <span className="text-sm font-medium text-gray-700">产品设计智能体</span>
                </Link>
                <p className="text-sm text-gray-500 mb-4">
                  AI驱动的产品设计平台，帮助设计师实现创意并提升效率
                </p>
                <SocialIcons />
              </div>
              
              {/* 产品功能 */}
              <div className="md:col-span-1">
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase mb-4">
                  产品功能
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/design-research" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      主题研究
                    </Link>
                  </li>
                  <li>
                    <Link href="/concept-image" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      概念推演
                    </Link>
                  </li>
                  <li>
                    <Link href="/3d-effect" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      3d设计
                    </Link>
                  </li>
                  <li>
                    <Link href="/style-transfer" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      风格转换
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* 支持与博客 */}
              <div className="md:col-span-1">
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase mb-4">
                  支持
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/design-research" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      使用文档
                    </Link>
                  </li>
                  <li>
                    <Link href="/design-research" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      设计指南
                    </Link>
                  </li>
                  <li>
                    <Link href="/debug" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      调试工具
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 分割线 */}
          <div className="border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} 产品设计智能体 - 由 Next.js 提供支持，可在 Vercel 上部署
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
