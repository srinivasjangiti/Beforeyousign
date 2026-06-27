import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pages = formData.get('pages') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'A PDF file is required.' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'The uploaded file is not a valid PDF.' },
        { status: 400 }
      );
    }

    if (!pages || pages.trim() === '') {
      return NextResponse.json(
        { error: 'Page ranges are required.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    let pdfDoc: PDFDocument;
    
    try {
      pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
    } catch (err: any) {
      if (err.message?.includes('encrypted') || err.name === 'EncryptedPDFError') {
        return NextResponse.json(
          { error: 'The PDF is encrypted. Unlock it first before splitting.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'The PDF file is corrupted or invalid.' },
        { status: 400 }
      );
    }
    
    const totalPages = pdfDoc.getPageCount();

    // Parse page ranges
    const pageIndices = parsePageRanges(pages, totalPages);

    if (pageIndices.length === 0) {
      return NextResponse.json(
        { error: `No valid pages found in range. The document has ${totalPages} pages.` },
        { status: 400 }
      );
    }

    // Create new PDF with selected pages
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();

    return new NextResponse(pdfBytes as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="split-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Split PDF error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while splitting the PDF.' },
      { status: 500 }
    );
  }
}

function parsePageRanges(ranges: string, totalPages: number): number[] {
  const indices: number[] = [];
  const parts = ranges.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr.trim());
      const end = parseInt(endStr.trim());
      
      if (isNaN(start) || isNaN(end)) continue;
      
      for (let i = start; i <= end && i <= totalPages; i++) {
        if (i > 0 && !indices.includes(i - 1)) {
          indices.push(i - 1); // Convert to 0-based index
        }
      }
    } else {
      const page = parseInt(trimmed);
      if (!isNaN(page) && page > 0 && page <= totalPages && !indices.includes(page - 1)) {
        indices.push(page - 1);
      }
    }
  }

  return indices.sort((a, b) => a - b);
}
