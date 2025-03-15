# DeepResearch AI

基于Dify.ai工作流技术的深度设计研究工具，为设计师和研究人员提供快速、详细的研究报告生成能力。

## 功能特点

- 通过简单输入生成深入的设计研究报告
- 支持多种设计主题和研究方向
- 可将研究结果下载为Word或TXT文档
- 提供流式和阻塞两种生成模式
- 内置调试模式，便于开发和测试

## 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/yourusername/deepresearch-ai.git
cd deepresearch-ai

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

然后在浏览器中访问 http://localhost:3000/design-research 开始使用。

### 环境变量

创建一个`.env.local`文件并设置以下环境变量:

```
DIFY_API_KEY_001_workflow=your_dify_api_key_here
```

## 使用方法

### 设计研究页面

1. 访问 `/design-research` 页面
2. 输入研究标题、研究主题和需求描述，或选择预设配置
3. 点击"开始处理"按钮启动研究生成流程
4. 等待系统生成研究报告
5. 查看研究报告，并根据需要下载为Word或文本文档

### 调试模式

要启用调试模式，可以点击页面顶部的"开启调试模式"按钮，或直接在URL中添加`?debug=true`参数。

调试模式下，页面将显示:
- API请求和响应详情
- 处理时间和延迟
- 流式生成的详细日志
- 错误信息和状态码

## 命令行测试工具

项目包含一个命令行测试工具，可以快速测试Dify API:

```bash
# 使用默认测试用例1
node test-dify-workflow.js

# 使用默认测试用例2
node test-dify-workflow.js 2

# 使用自定义参数
node test-dify-workflow.js title="自定义标题" topic="自定义主题" requirements="自定义需求"
```

## 技术架构

- **前端框架**: Next.js + React
- **UI组件**: 自定义组件 + TailwindCSS
- **API集成**: Dify.ai工作流 API
- **文档生成**: docx + file-saver

## 项目结构

```
deepresearch-ai/
├── app/
│   ├── api/
│   │   └── dify/          # Dify API代理
│   ├── components/        # 共享组件
│   ├── design-research/   # 设计研究页面
│   └── utils/             # 工具函数
├── public/                # 静态资源
├── test-dify-workflow.js  # API测试脚本
└── README.md              # 项目文档
```

## 开发指南

### API调试

当启用调试模式时，所有API请求和响应都会在控制台和页面上显示详细信息。这有助于排查问题或了解工作流的执行过程。

### 修改生成的文档格式

如需修改Word文档的生成逻辑，请编辑`app/utils/documentUtils.ts`文件。该文件定义了如何将纯文本转换为结构化的Word文档。

## 贡献指南

欢迎提交Pull Request或Issue来改进这个项目。在提交之前，请确保:

1. 代码风格符合项目规范
2. 所有测试通过
3. 提供清晰的PR描述

## 许可证

MIT
