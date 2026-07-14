import { PDFDocument, PageSizes } from 'pdf-lib';
import sharp from 'sharp';
import { OperationContext, ImageOptions, EngineResult } from '../types';
import { PDFEngineError, CorruptPDFError } from '../errors';

export async function executeImageToPdf(
  context: OperationContext<ImageOptions>
): Promise<EngineResult> {
  const { files, options, logger, requestId } = context;
  const startTime = Date.now();
  
  logger?.info(`[${requestId}] Starting imageToPdf operation`, { fileCount: files.length, options });

  try {
    const pdfDoc = await PDFDocument.create();
    const pageDimensions = options.format === 'A4' ? PageSizes.A4 : PageSizes.Letter;
    let originalSize = 0;
    const warnings: string[] = [];

    for (const file of files) {
      originalSize += file.size;

      let processedBuffer: Buffer;
      try {
        // Use sharp to auto-orient based on EXIF and standardize to JPEG
        processedBuffer = await sharp(Buffer.from(file.buffer))
          .rotate() 
          .jpeg({ quality: 95 })
          .toBuffer();
      } catch (err) {
        throw new CorruptPDFError(`Failed to process image '${file.name}'. It may be corrupted.`);
      }

      const image = await pdfDoc.embedJpg(processedBuffer);

      const page = pdfDoc.addPage(pageDimensions);
      const { width, height } = page.getSize();
      
      const margin = 40;
      const maxWidth = width - (margin * 2);
      const maxHeight = height - (margin * 2);

      const imgDims = image.scale(1);
      const scale = Math.min(
        maxWidth / imgDims.width,
        maxHeight / imgDims.height
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
    const durationMs = Date.now() - startTime;
    
    logger?.info(`[${requestId}] ImageToPdf completed successfully`, { 
      durationMs, 
      outputSize: pdfBytes.length, 
      pages: pdfDoc.getPageCount() 
    });

    return {
      success: true,
      buffer: pdfBytes,
      filename: `images-to-pdf-${Date.now()}.pdf`,
      mimeType: 'application/pdf',
      warnings,
      metadata: {
        pages: pdfDoc.getPageCount(),
        originalSize,
        outputSize: pdfBytes.length,
        durationMs,
      }
    };
  } catch (error: any) {
    logger?.error(`[${requestId}] ImageToPdf failed`, error);
    if (error.name === 'CorruptPDFError' || error.name === 'PDFValidationError') {
      throw error;
    }
    throw new PDFEngineError(error.message || 'An unexpected error occurred during image to PDF conversion.');
  }
}
