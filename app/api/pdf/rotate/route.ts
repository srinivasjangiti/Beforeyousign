import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, degrees } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const rotation = parseInt(formData.get('rotation') as string) || 90; // 90, 180, 270
    const pages = formData.get('pages') as string; // "all" or "1,3,5"

    if (!file) {
      return NextResponse.json(
        { error: 'PDF file required' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Determine which pages to rotate
    const pageIndices = pages === 'all' 
      ? Array.from({ length: totalPages }, (_, i) => i)
      : parsePages(pages, totalPages);

    // Rotate specified pages
    for (const index of pageIndices) {
      const page = pdfDoc.getPage(index);
      page.setRotation(degrees(rotation));
    }

    const rotatedBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(rotatedBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rotated-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Rotate PDF error:', error);
    return NextResponse.json(
      { error: 'Failed to rotate PDF' },
      { status: 500 }
    );
  }
}

function parsePages(pages: string, totalPages: number): number[] {
  return pages.split(',')
    .map(p => parseInt(p.trim()) - 1)
    .filter(i => i >= 0 && i < totalPages);
}
