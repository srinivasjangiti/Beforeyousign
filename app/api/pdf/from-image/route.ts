import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const pageSize = formData.get('pageSize') as string || 'A4'; // A4, Letter, etc.

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'At least one image file required' },
        { status: 400 }
      );
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Determine image type and embed
      let image;
      if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
        image = await pdfDoc.embedPng(buffer);
      } else if (file.type === 'image/jpeg' || file.name.toLowerCase().match(/\.(jpg|jpeg)$/)) {
        image = await pdfDoc.embedJpg(buffer);
      } else {
        // Convert other formats to JPEG using sharp
        const converted = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
        image = await pdfDoc.embedJpg(converted);
      }

      // Add page with image
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      // Scale image to fit page while maintaining aspect ratio
      const imgDims = image.scale(1);
      const scale = Math.min(
        (width - 40) / imgDims.width,
        (height - 40) / imgDims.height
      );

      const scaledWidth = imgDims.width * scale;
      const scaledHeight = imgDims.height * scale;

      page.drawImage(image, {
        x: (width - scaledWidth) / 2,
        y: (height - scaledHeight) / 2,
        width: scaledWidth,
        height: scaledHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="images-to-pdf-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Image to PDF error:', error);
    return NextResponse.json(
      { error: 'Failed to convert images to PDF: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
