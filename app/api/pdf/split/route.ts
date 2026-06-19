import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pages = formData.get('pages') as string; // e.g., "1-3,5,7-10"

    if (!file) {
      return NextResponse.json(
        { error: 'PDF file required' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Parse page ranges
    const pageIndices = parsePageRanges(pages, totalPages);

    if (pageIndices.length === 0) {
      return NextResponse.json(
        { error: 'No valid pages specified' },
        { status: 400 }
      );
    }

    // Create new PDF with selected pages
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="split-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Split PDF error:', error);
    return NextResponse.json(
      { error: 'Failed to split PDF' },
      { status: 500 }
    );
  }
}

function parsePageRanges(ranges: string, totalPages: number): number[] {
  const indices: number[] = [];
  const parts = ranges.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(s => parseInt(s.trim()));
      for (let i = start; i <= end && i <= totalPages; i++) {
        if (i > 0 && !indices.includes(i - 1)) {
          indices.push(i - 1); // Convert to 0-based index
        }
      }
    } else {
      const page = parseInt(trimmed);
      if (page > 0 && page <= totalPages && !indices.includes(page - 1)) {
        indices.push(page - 1);
      }
    }
  }

  return indices.sort((a, b) => a - b);
}
