import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

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

    const arrayBuffer = await file.arrayBuffer();
    let pdfDoc: PDFDocument;
    
    try {
      pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
    } catch (err: any) {
      if (err.message?.includes('encrypted') || err.name === 'EncryptedPDFError') {
        return NextResponse.json(
          { error: 'The PDF is encrypted. Unlock it first before optimizing.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'The PDF file is corrupted or invalid.' },
        { status: 400 }
      );
    }

    // Optimize by re-saving with structural optimization
    // Note: This does not compress raster images, only internal structural streams
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    const originalSize = arrayBuffer.byteLength;
    const compressedSize = compressedBytes.byteLength;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    return new NextResponse(compressedBytes as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="optimized-${Date.now()}.pdf"`,
        'X-Original-Size': originalSize.toString(),
        'X-Compressed-Size': compressedSize.toString(),
        'X-Compression-Ratio': compressionRatio,
      },
    });
  } catch (error) {
    console.error('Optimize PDF error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while optimizing the PDF.' },
      { status: 500 }
    );
  }
}
