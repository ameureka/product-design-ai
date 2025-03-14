# 产品设计智能体 (Product Design AI)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ameureka/product-design-ai)

<div align="center">
  <img src="public/logo.png" alt="产品设计智能体Logo" width="120" />
  <h3>AI驱动的产品设计平台</h3>
  <p>帮助设计师实现创意并提升效率的一站式智能设计工具</p>
</div>

## 📋 项目概述

产品设计智能体是一个基于AI技术的设计辅助平台，旨在帮助设计师和产品团队快速进行设计主题研究、概念图生成、效果处理和输出。该平台集成了多种设计工具和AI算法，为用户提供从创意发想到设计输出的全流程支持。

### ✨ 核心功能

- **设计主题研究**：快速生成设计主题分析和相关参考资料
- **概念图生成**：基于文本描述自动生成产品概念图
- **平面效果处理**：多种平面视觉效果处理工具
- **3D效果转换**：将2D图像转换为多种3D效果视图
- **风格转换**：应用不同艺术风格到设计图像中
- **板式输出**：生成专业的排版设计和板式输出
- **演示动画**：快速创建设计演示动画

## 🚀 技术栈

- **前端框架**：Next.js 15
- **样式解决方案**：Tailwind CSS
- **字体**：Geist Sans & Geist Mono
- **部署平台**：Vercel

## 🛠️ 安装与运行

### 前提条件

- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/ameureka/product-design-ai.git
cd product-design-ai
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 运行开发服务器
```bash
npm run dev
# 或
yarn dev
```

4. 构建生产版本
```bash
npm run build
# 或
yarn build
```

## 🔍 项目结构

```
product-design-ai/
├── app/                    # Next.js 应用目录
│   ├── components/         # 共享组件
│   │   ├── Icons.tsx       # 图标组件
│   │   ├── ImageProcessor.tsx # 图像处理组件
│   │   ├── Logo.tsx        # Logo组件 
│   │   ├── NavigationBar.tsx # 导航栏组件
│   │   └── SocialIcons.tsx # 社交媒体图标组件
│   ├── 3d-effect/          # 3D效果页面
│   ├── concept-image/      # 概念图生成页面
│   ├── design-research/    # 设计主题研究页面
│   ├── flat-effect/        # 平面效果页面
│   ├── layout-output/      # 板式输出页面
│   ├── style-transfer/     # 风格转换页面
│   ├── demo-animation/     # 演示动画页面
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局组件
│   ├── metadata.tsx        # 网站元数据
│   └── page.tsx            # 主页
├── public/                 # 静态资源
│   └── logo.png            # 网站logo
├── .eslintrc.json          # ESLint配置
├── .gitignore              # Git忽略文件
├── next.config.js          # Next.js配置
├── package.json            # 项目依赖
├── postcss.config.js       # PostCSS配置
├── tailwind.config.js      # Tailwind配置
└── tsconfig.json           # TypeScript配置
```

## 📱 功能展示

### 设计主题研究
输入设计主题关键词，AI将生成相关的设计研究报告，包括市场趋势、色彩分析、形态研究等。

### 概念图生成
基于文本描述自动生成产品概念图，支持多种风格和形态。

### 平面效果
提供多种平面视觉效果处理选项，如滤镜、纹理、叠加等。

### 3D效果
将平面图像转换为立体浮雕、等距3D、透视3D等多种3D效果。

### 风格转换
应用油画、水彩、素描等多种艺术风格到设计图像中。

### 板式输出
生成海报、杂志、社交媒体等多种专业排版设计。

### 演示动画
快速生成设计演示动画，支持多种过渡效果和动画样式。

## 🔄 工作流程

1. **研究阶段**：使用设计主题研究工具收集灵感和设计方向
2. **概念阶段**：使用概念图生成工具创建初步设计
3. **设计阶段**：使用效果处理工具（平面效果、3D效果、风格转换）完善设计
4. **输出阶段**：使用板式输出和演示动画工具展示最终设计

## 🌐 一键部署

点击下方按钮，可以一键将项目部署到Vercel平台：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ameureka/product-design-ai)

## 📝 许可证

[MIT](LICENSE)

## 👥 联系我们

- Twitter: [@productdesignai](https://twitter.com/productdesignai)
- YouTube: [产品设计智能体](https://youtube.com/c/productdesignai)
- 小红书: [产品设计智能体](https://xiaohongshu.com/user/productdesignai)
- 邮箱: contact@productdesignai.com
