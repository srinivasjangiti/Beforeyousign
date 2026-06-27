import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 PDF files are required for merging.' },
        { status: 400 }
      );
    }

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json(
          { error: `File '${file.name}' is not a valid PDF.` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      
      let pdf: PDFDocument;
      try {
        pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
      } catch (err: any) {
        if (err.message?.includes('encrypted') || err.name === 'EncryptedPDFError') {
          return NextResponse.json(
            { error: `File '${file.name}' is encrypted and cannot be merged.` },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: `File '${file.name}' is corrupted or invalid.` },
          { status: 400 }
        );
      }

      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();

    // Return as downloadable file
    return new NextResponse(mergedPdfBytes as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="merged-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Merge PDF error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while merging PDFs.' },
      { status: 500 }
    );
  }
}
