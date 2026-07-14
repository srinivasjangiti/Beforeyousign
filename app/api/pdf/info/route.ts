import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'PDF file required' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Extract metadata
    const pageCount = pdfDoc.getPageCount();
    const title = pdfDoc.getTitle() || 'Untitled';
    const author = pdfDoc.getAuthor() || 'Unknown';
    const subject = pdfDoc.getSubject() || '';
    const creator = pdfDoc.getCreator() || '';
    const producer = pdfDoc.getProducer() || '';
    const creationDate = pdfDoc.getCreationDate();
    const modificationDate = pdfDoc.getModificationDate();

    // Get page dimensions
    const pages = pdfDoc.getPages();
    const pageDimensions = pages.map((page, index) => {
      const { width, height } = page.getSize();
      return {
        page: index + 1,
        width: Math.round(width),
        height: Math.round(height),
        orientation: width > height ? 'landscape' : 'portrait',
      };
    });

    // Calculate file size
    const fileSize = arrayBuffer.byteLength;
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

    return NextResponse.json({
      success: true,
      metadata: {
        title,
        author,
        subject,
        creator,
        producer,
        creationDate: creationDate?.toISOString(),
        modificationDate: modificationDate?.toISOString(),
      },
      stats: {
        pageCount,
        fileSize,
        fileSizeMB: `${fileSizeMB} MB`,
        avgPageSize: `${(fileSize / pageCount / 1024).toFixed(2)} KB`,
      },
      pages: pageDimensions,
    });
  } catch (error) {
    console.error('PDF Info error:', error);
    return NextResponse.json(
      { error: 'Failed to extract PDF information' },
      { status: 500 }
    );
  }
}
