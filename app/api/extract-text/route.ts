import { NextRequest, NextResponse } from 'next/server';
import { DocumentParser } from '@/lib/document-parser';

// Maximum characters to return to prevent overflowing AI context windows
const MAX_TEXT_CHARS = 100000;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size and type
    if (!DocumentParser.validateFileSize(file)) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    if (!DocumentParser.validateFileType(file)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.' },
        { status: 400 }
      );
    }

    // Extract text
    let text = await DocumentParser.parse(file);

    // Truncate if necessary
    if (text.length > MAX_TEXT_CHARS) {
      text = text.slice(0, MAX_TEXT_CHARS);
      console.warn(`Text extracted from ${file.name} was truncated to ${MAX_TEXT_CHARS} characters.`);
    }

    return NextResponse.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to extract text from document' },
      { status: 500 }
    );
  }
}
