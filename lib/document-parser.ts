// Document parsing utilities for PDF, DOCX, and TXT files

import mammoth from 'mammoth';

export class DocumentParser {
  /**
   * Parse document based on file type
   */
  static async parse(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const fileType = file.type;

    if (fileType === 'application/pdf') {
      return this.parsePDF(Buffer.from(buffer));
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      return this.parseDOCX(Buffer.from(buffer));
    } else if (fileType === 'text/plain') {
      return this.parseTXT(Buffer.from(buffer));
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  /**
   * Parse PDF document
   */
  private static async parsePDF(buffer: Buffer): Promise<string> {
    try {
      // Lazy load pdf-parse to prevent Vercel serverless environment crashes during module initialization
      const pdfParseModule = await import('pdf-parse');
      // @ts-ignore - pdf-parse has ESM/CJS compatibility issues
      const pdf = pdfParseModule.default || pdfParseModule;
      const data = await pdf(buffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse DOCX document
   */
  private static async parseDOCX(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new Error(`Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse plain text document
   */
  private static parseTXT(buffer: Buffer): Promise<string> {
    try {
      return Promise.resolve(buffer.toString('utf-8'));
    } catch (error) {
      throw new Error(`Failed to parse TXT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate file size
   */
  static validateFileSize(file: File, maxSizeInBytes: number = 10 * 1024 * 1024): boolean {
    return file.size <= maxSizeInBytes;
  }

  /**
   * Validate file type
   */
  static validateFileType(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    return allowedTypes.includes(file.type);
  }
}
