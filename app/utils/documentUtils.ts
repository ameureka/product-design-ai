// 导入必要的库
import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

/**
 * 将文本内容转换为Word文档并下载
 * @param content 要转换的文本内容
 * @param fileName 文件名，不包含扩展名
 */
export async function generateWordDocument(content: string, fileName: string = 'document'): Promise<void> {
  // 按换行符分割内容
  const lines = content.split('\n');
  
  // 解析内容，将其转换为文档结构
  const children = [];
  
  // 增强的解析：支持更多Markdown格式
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 跳过空行
    if (!line) {
      continue;
    }
    
    // 处理标题 - 使用正则表达式匹配所有标题格式
    if (line.match(/^#+\s+.+/)) {
      const level = line.match(/^(#+)/)?.[0].length || 1;
      const content = line.replace(/^#+\s+/, '');
      
      // 根据级别设置标题级别
      let heading;
      switch(level) {
        case 1: 
          children.push(
            new Paragraph({
              text: content,
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 }
            })
          );
          break;
        case 2:
          children.push(
            new Paragraph({
              text: content,
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 }
            })
          );
          break;
        case 3:
          children.push(
            new Paragraph({
              text: content,
              heading: HeadingLevel.HEADING_3,
              spacing: { after: 200 }
            })
          );
          break;
        case 4:
          children.push(
            new Paragraph({
              text: content,
              heading: HeadingLevel.HEADING_4,
              spacing: { after: 200 }
            })
          );
          break;
        default:
          children.push(
            new Paragraph({
              text: content,
              heading: HeadingLevel.HEADING_5,
              spacing: { after: 200 }
            })
          );
          break;
      }
    } else if (line.match(/^[\-\*]\s+.+/)) {
      // 处理无序列表
      const content = line.replace(/^[\-\*]\s+/, '');
      children.push(
        new Paragraph({
          children: processInlineFormatting(content),
          bullet: {
            level: 0
          },
          spacing: { after: 100 }
        })
      );
    } else if (line.match(/^\d+\.\s+.+/)) {
      // 处理有序列表
      const content = line.replace(/^\d+\.\s+/, '');
      children.push(
        new Paragraph({
          children: processInlineFormatting(content),
          numbering: {
            reference: "1", // 使用字符串类型
            level: 0
          },
          spacing: { after: 100 }
        })
      );
    } else {
      // 常规段落，处理行内格式
      children.push(
        new Paragraph({
          children: processInlineFormatting(line),
          spacing: { after: 120 }
        })
      );
    }
  }
  
  // 创建文档
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children
      }
    ]
  });
  
  // 生成Word文档并下载
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  saveAs(blob, `${fileName}.docx`);
}

/**
 * 处理文本中的行内格式（如加粗、斜体等）
 * @param text 要处理的文本
 * @returns 包含格式化文本部分的数组
 */
function processInlineFormatting(text: string): TextRun[] {
  const result: TextRun[] = [];
  
  // 如果没有特殊格式标记，直接返回普通文本
  if (!text.includes('**') && !text.includes('*') && !text.includes('`')) {
    return [new TextRun(text)];
  }
  
  // 处理加粗文本 (** **)
  let remainingText = text;
  let currentIndex = 0;
  
  while (currentIndex < remainingText.length) {
    // 查找下一个加粗标记
    const boldStartIndex = remainingText.indexOf('**', currentIndex);
    
    if (boldStartIndex === -1) {
      // 没有更多加粗标记，添加剩余文本
      if (currentIndex < remainingText.length) {
        result.push(new TextRun(remainingText.substring(currentIndex)));
      }
      break;
    }
    
    // 添加加粗标记前的普通文本
    if (boldStartIndex > currentIndex) {
      result.push(new TextRun(remainingText.substring(currentIndex, boldStartIndex)));
    }
    
    // 查找加粗结束标记
    const boldEndIndex = remainingText.indexOf('**', boldStartIndex + 2);
    if (boldEndIndex === -1) {
      // 未找到结束标记，将当前位置到结尾作为普通文本
      result.push(new TextRun(remainingText.substring(currentIndex)));
      break;
    }
    
    // 提取加粗文本内容
    const boldText = remainingText.substring(boldStartIndex + 2, boldEndIndex);
    result.push(
      new TextRun({
        text: boldText,
        bold: true
      })
    );
    
    // 更新当前位置
    currentIndex = boldEndIndex + 2;
  }
  
  return result.length > 0 ? result : [new TextRun(text)];
} 