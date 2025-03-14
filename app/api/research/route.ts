import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 模拟研究数据
const MOCK_RESEARCH = `# 模拟研究报告

## 引言
这是一个模拟的研究报告，用于在没有有效API密钥时展示应用程序的功能。

## 主要内容
- 第一点：这是模拟数据
- 第二点：请配置有效的OpenAI API密钥以获取真实内容
- 第三点：在.env.local文件中设置OPENAI_API_KEY

## 结论
这个应用程序需要有效的API密钥才能正常工作。请参考README.md获取更多信息。`;

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: '主题是必需的' },
        { status: 400 }
      );
    }

    // 检查API密钥是否配置
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.warn('未配置OpenAI API密钥，返回模拟数据');
      return NextResponse.json({ research: MOCK_RESEARCH });
    }

    // 使用OpenAI API进行深度研究
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "你是一个专业的研究员，善于深入分析主题并提供详尽的研究报告。请提供结构清晰、内容全面的研究报告，包含引言、背景、主要论点、分析、结论等部分。"
          },
          {
            role: "user",
            content: `请对以下主题进行深入研究并撰写一篇全面的研究报告：${topic}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const research = response.choices[0].message.content;
      return NextResponse.json({ research });
    } catch (apiError) {
      console.error('OpenAI API调用失败:', apiError);
      return NextResponse.json({ research: MOCK_RESEARCH + `\n\n## 错误信息\n调用OpenAI API时出错，请检查API密钥是否有效。` });
    }
  } catch (error) {
    console.error('研究生成出错:', error);
    return NextResponse.json(
      { error: '生成研究时出错' },
      { status: 500 }
    );
  }
} 