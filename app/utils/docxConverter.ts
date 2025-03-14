import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

/**
 * 将markdown格式的研究文本转换为Word文档
 * @param researchText 研究文本（markdown格式）
 * @param title 文档标题
 * @returns 返回Blob对象
 */
export async function convertToDocx(researchText: string, title: string): Promise<Blob> {
  // 简单的Markdown解析
  const lines = researchText.split('\n');
  const docElements = [];

  // 添加标题
  docElements.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    })
  );

  // 添加创建日期
  docElements.push(
    new Paragraph({
      text: `生成日期: ${new Date().toLocaleDateString()}`,
      alignment: AlignmentType.CENTER,
    })
  );

  // 分隔线（空行）
  docElements.push(new Paragraph({}));

  // 解析Markdown文本
  let inCodeBlock = false;
  
  for (const line of lines) {
    // 处理标题
    if (line.startsWith('# ')) {
      docElements.push(
        new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1,
        })
      );
    } else if (line.startsWith('## ')) {
      docElements.push(
        new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2,
        })
      );
    } else if (line.startsWith('### ')) {
      docElements.push(
        new Paragraph({
          text: line.substring(4),
          heading: HeadingLevel.HEADING_3,
        })
      );
    } else if (line.startsWith('```')) {
      // 代码块开始或结束
      inCodeBlock = !inCodeBlock;
    } else if (inCodeBlock) {
      // 在代码块内部
      docElements.push(
        new Paragraph({
          text: line,
          style: 'CodeBlock',
        })
      );
    } else if (line.trim() === '') {
      // 空行
      docElements.push(new Paragraph({}));
    } else {
      // 普通段落
      docElements.push(
        new Paragraph({
          text: line,
        })
      );
    }
  }

  // 创建文档
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docElements,
      },
    ],
  });

  // 将文档打包为Blob
  return await Packer.toBlob(doc);
} 