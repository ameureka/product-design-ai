# Vercel 一键部署指南

本文档提供将深度研究应用程序部署到 Vercel 平台的详细步骤。

## 前置条件

1. 拥有一个 [GitHub](https://github.com/) 账户
2. 拥有一个 [Vercel](https://vercel.com/) 账户
3. 拥有以下 API 密钥:
   - OpenAI API 密钥
   - Dify.ai API 密钥 (工作流、API 和聊天密钥)

## 一键部署步骤

### 方法一：使用部署按钮（最简单）

点击下面的按钮，将自动引导您完成部署流程：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fameureka%2Fproduct-design-ai&env=OPENAI_API_KEY,DIFY_API_KEY_001_workflow,DIFY_API_KEY_API,DIFY_API_KEY_CHAT,NEXTAUTH_SECRET&envDescription=请填写所需的API密钥&envLink=https://github.com/ameureka/product-design-ai/blob/main/VERCEL_DEPLOYMENT.md&project-name=deep-research-ai&repository-name=deep-research-ai)

### 方法二：手动部署步骤

1. 登录您的 Vercel 账户
2. 点击 "New Project" 按钮
3. 在 "Import Git Repository" 部分，选择 "Import Third-Party Git Repository"
4. 输入仓库 URL: `https://github.com/ameureka/product-design-ai`
5. 点击 "Continue"
6. 配置项目设置 (可以使用默认值)
7. 在 "Environment Variables" 部分，添加以下环境变量:

| 名称 | 描述 | 示例值 |
|------|------|---------|
| OPENAI_API_KEY | OpenAI API 密钥 | sk-... |
| DIFY_API_KEY_001_workflow | Dify 工作流 API 密钥 | app-... |
| DIFY_API_KEY_API | Dify API 密钥 | app-... |
| DIFY_API_KEY_CHAT | Dify 聊天 API 密钥 | app-... |
| NEXTAUTH_SECRET | NextAuth 安全密钥 | 一个随机字符串 |

8. 点击 "Deploy" 按钮

## 验证部署

部署完成后，您可以通过以下方式验证部署是否成功:

1. 访问 Vercel 提供的部署网址
2. 打开 `/debug` 页面检查 API 配置
3. 测试应用的设计研究功能

## 常见问题

### 环境变量问题

如果您遇到与 API 密钥相关的问题，请检查:

1. 确保您已正确设置所有环境变量
2. 密钥格式正确无误
3. 在 Vercel 项目设置中检查环境变量是否已正确应用

### 部署失败

如果部署失败，请检查:

1. 构建日志中的错误信息
2. 确认 Vercel 所需权限已授予
3. 确保您的 API 密钥有效

### 域名设置

要使用自定义域名:

1. 在 Vercel 项目设置中，导航到 "Domains" 部分
2. 添加您的自定义域名
3. 按照提示完成 DNS 配置

## 更新部署

当源代码有更新时，Vercel 会自动重新部署您的项目。如果您需要手动触发重新部署:

1. 在 Vercel 项目仪表板中，点击 "Deployments" 标签
2. 点击 "Redeploy" 按钮

## 支持和反馈

如果您在部署过程中遇到任何问题，请通过 GitHub 仓库的 Issues 部分提交问题。 