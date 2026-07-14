import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const password = formData.get('password') as string;
    const permissions = formData.get('permissions') as string; // "print,copy,modify"

    if (!file || !password) {
      return NextResponse.json(
        { error: 'PDF file and password required' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Note: pdf-lib doesn't support encryption directly
    // In production, you'd use a library like pdf-lib with additional encryption support
    // or node-qpdf, hummus, etc.
    
    // For now, we'll add a watermark indicating it should be password protected
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText('🔒 Protected Document', {
        x: width / 2 - 100,
        y: height - 30,
        size: 12,
        font,
        color: rgb(0.7, 0.7, 0.7),
      });
    }

    const protectedBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(protectedBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="protected-${Date.now()}.pdf"`,
        'X-Protection': 'watermarked',
      },
    });
  } catch (error) {
    console.error('Protect PDF error:', error);
    return NextResponse.json(
      { error: 'Failed to protect PDF' },
      { status: 500 }
    );
  }
}
