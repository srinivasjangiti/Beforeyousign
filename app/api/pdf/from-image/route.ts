import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, PageSizes } from 'pdf-lib';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const pageSize = formData.get('pageSize') as string || 'A4';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'At least one image file is required.' },
        { status: 400 }
      );
    }

    const pdfDoc = await PDFDocument.create();

    const pageDimensions = pageSize.toLowerCase() === 'letter' ? PageSizes.Letter : PageSizes.A4;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return NextResponse.json(
          { error: `File '${file.name}' is not a valid image.` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // We MUST use sharp to process all images first to handle EXIF orientation.
      // pdf-lib ignores EXIF orientation, causing mobile photos to appear sideways.
      // .rotate() without arguments auto-orients based on EXIF.
      let processedBuffer;
      try {
        processedBuffer = await sharp(buffer)
          .rotate() // Auto-orient
          .jpeg({ quality: 95 })
          .toBuffer();
      } catch (err) {
        return NextResponse.json(
          { error: `Failed to process image '${file.name}'. It may be corrupted.` },
          { status: 400 }
        );
      }

      const image = await pdfDoc.embedJpg(processedBuffer);

      const page = pdfDoc.addPage(pageDimensions);
      const { width, height } = page.getSize();
      
      // Calculate scaling to fit within page margins (e.g. 40 points = ~0.5 inch margin)
      const margin = 40;
      const maxWidth = width - (margin * 2);
      const maxHeight = height - (margin * 2);

      const imgDims = image.scale(1);
      const scale = Math.min(
        maxWidth / imgDims.width,
        maxHeight / imgDims.height
      );

      // If the image is smaller than the max area, we don't necessarily want to upscale it
      // unless requested, but usually filling the page looks better for scanned docs.
      // We will only downscale to fit, or optionally upscale if it's very small, but 
      // let's stick to standard "fit within area" logic which handles both.

      const scaledWidth = imgDims.width * scale;
      const scaledHeight = imgDims.height * scale;

      // Center the image on the page
      page.drawImage(image, {
        x: (width - scaledWidth) / 2,
        y: (height - scaledHeight) / 2,
        width: scaledWidth,
        height: scaledHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="images-to-pdf-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Image to PDF error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while converting images to PDF.' },
      { status: 500 }
    );
  }
}
