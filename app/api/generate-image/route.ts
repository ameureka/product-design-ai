import { NextResponse } from 'next/server';
import axios from 'axios';
import OpenAI from 'openai';

// 初始化OpenAI客户端用于关键词提取
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 假设MindJoury API的基础URL
const MINDJOURY_API_URL = 'https://api.mindjourney.com/v1/images/generations';

// 模拟关键词和图片URL
const MOCK_KEYWORDS = "人工智能, 深度学习, 机器学习, 数据分析, 技术创新";
const MOCK_IMAGE_URL = "https://placehold.co/1024x1024/EEE/31343C?text=模拟图片&font=OpenSans";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: '文本内容是必需的' },
        { status: 400 }
      );
    }

    // 检查API密钥是否配置
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.warn('未配置OpenAI API密钥，返回模拟数据');
      return NextResponse.json({
        keywords: MOCK_KEYWORDS,
        imageUrl: MOCK_IMAGE_URL,
        source: "模拟数据"
      });
    }

    // 使用OpenAI提取关键词
    try {
      const keywordsResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "你是一个专业的关键词提取器。请从给定的文本中提取5-10个最重要的关键词，这些关键词将用于生成相关的设计图片。"
          },
          {
            role: "user",
            content: `请从以下文本中提取关键词，以逗号分隔：${text}`
          }
        ],
        temperature: 0.3,
        max_tokens: 100,
      });

      const keywords = keywordsResponse.choices[0].message.content;

      // 调用MindJoury API生成图片
      // 注意：由于MindJoury API是假设的，您需要根据实际API进行调整
      try {
        const imageResponse = await axios.post(
          MINDJOURY_API_URL,
          {
            prompt: keywords,
            n: 1,
            size: "1024x1024",
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.MINDJOURY_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // 假设返回的格式
        const imageUrl = imageResponse.data.data[0].url;

        return NextResponse.json({
          keywords,
          imageUrl,
        });
      } catch (apiError) {
        console.error('MindJoury API调用失败:', apiError);
        
        // 如果MindJoury API不可用，使用OpenAI的DALL-E作为备选
        try {
          const dalleResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: keywords as string,
            n: 1,
            size: "1024x1024",
          });

          const imageUrl = dalleResponse.data[0].url;

          return NextResponse.json({
            keywords,
            imageUrl,
            source: "DALL-E (备选)",
          });
        } catch (dalleError) {
          console.error('DALL-E API调用失败:', dalleError);
          return NextResponse.json({
            keywords,
            imageUrl: MOCK_IMAGE_URL,
            source: "模拟图片 (API错误)"
          });
        }
      }
    } catch (openaiError) {
      console.error('OpenAI关键词提取失败:', openaiError);
      return NextResponse.json({
        keywords: MOCK_KEYWORDS,
        imageUrl: MOCK_IMAGE_URL,
        source: "模拟数据 (API错误)"
      });
    }
  } catch (error) {
    console.error('图片生成出错:', error);
    return NextResponse.json(
      { error: '生成图片时出错' },
      { status: 500 }
    );
  }
} 