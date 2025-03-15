# Dify.ai工作流集成指南

本文档介绍如何将Dify.ai工作流集成到产品设计智能体应用中。

## 配置步骤

### 1. 环境变量设置

首先，配置您的`.env.local`文件，添加Dify.ai的API密钥：

```
# Dify.ai 配置
DIFY_API_KEY_001_workflow=your_dify_api_key_here
```

您需要从Dify.ai平台获取API密钥。在Dify.ai控制面板中：
1. 登录您的账户
2. 找到应用设置
3. 复制API密钥(API Key)

### 2. 安装依赖

确保已安装node-fetch和file-saver依赖：

```bash
npm install node-fetch file-saver
```

## 测试Dify工作流

您可以使用测试脚本检查Dify.ai工作流是否正常工作：

```bash
node test-dify-workflow.js
```

测试脚本支持两种模式：
- 阻塞式响应（单次完整响应）
- 流式响应（逐步返回结果）

## 集成到新页面

如果需要将Dify工作流集成到新的功能页面，只需按照以下步骤操作：

1. 引入DifyWorkflowProcessor组件
2. 配置输入字段和预设内容
3. 处理结果回调

示例代码：

```jsx
'use client';

import { useState } from 'react';
import DifyWorkflowProcessor from '../components/DifyWorkflowProcessor';

export default function YourFeaturePage() {
  const [result, setResult] = useState('');

  const handleComplete = (data) => {
    if (data.answer) {
      setResult(data.answer);
    }
  };

  const inputFields = [
    {
      id: 'field1',
      label: '字段1',
      placeholder: '请输入...',
    },
    {
      id: 'field2',
      label: '字段2',
      placeholder: '请输入...',
      type: 'textarea'
    }
  ];
  
  const presets = [
    {
      name: '预设1',
      values: {
        field1: '预设值1',
        field2: '预设值2'
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold">功能页面</h1>
      
      <DifyWorkflowProcessor 
        title="功能标题"
        description="功能描述"
        inputFields={inputFields}
        presets={presets}
        onProcessComplete={handleComplete}
      />
    </div>
  );
}
```

## API路由说明

应用已配置`/api/dify`路由，它会自动处理与Dify.ai的通信，支持：

1. 阻塞式响应 - 适合短小内容
2. 流式响应 - 适合长篇生成内容

如需自定义API路由行为，可以修改`app/api/dify/route.ts`文件。 