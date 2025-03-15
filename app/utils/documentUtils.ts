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
  
  // 基本解析：将以#开头的行解析为标题，其余为正文
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 跳过空行
    if (!line) {
      continue;
    }
    
    // 处理标题
    if (line.startsWith('# ')) {
      children.push(
        new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        })
      );
    } else if (line.startsWith('## ')) {
      children.push(
        new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 }
        })
      );
    } else if (line.startsWith('### ')) {
      children.push(
        new Paragraph({
          text: line.substring(4),
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 200 }
        })
      );
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      // 处理列表项
      children.push(
        new Paragraph({
          text: line.substring(2),
          bullet: {
            level: 0
          },
          spacing: { after: 100 }
        })
      );
    } else {
      // 常规段落
      children.push(
        new Paragraph({
          text: line,
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