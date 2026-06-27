import { PDFDocument, degrees } from 'pdf-lib';
import { OperationContext, RotateOptions, EngineResult } from '../types';
import { EncryptedPDFError, CorruptPDFError, PDFValidationError, PDFEngineError } from '../errors';
import { parsePageRanges } from '../utils/pageRanges';

export async function executeRotate(
  context: OperationContext<RotateOptions>
): Promise<EngineResult> {
  const { files, options, logger, requestId } = context;
  const startTime = Date.now();
  const file = files[0];
  
  logger?.info(`[${requestId}] Starting rotate operation`, { fileName: file.name, options });

  try {
    let pdfDoc: PDFDocument;
    
    try {
      pdfDoc = await PDFDocument.load(file.buffer, { ignoreEncryption: false });
    } catch (err: any) {
      if (err.message?.includes('encrypted') || err.name === 'EncryptedPDFError') {
        throw new EncryptedPDFError(`The PDF '${file.name}' is encrypted. Unlock it first before rotating.`);
      }
      throw new CorruptPDFError(`The PDF file '${file.name}' is corrupted or invalid.`);
    }

    const totalPages = pdfDoc.getPageCount();
    const pagesOption = options.pages || 'all';

    const pageIndices = pagesOption.toLowerCase() === 'all' 
      ? Array.from({ length: totalPages }, (_, i) => i)
      : parsePageRanges(pagesOption, totalPages);

    if (pageIndices.length === 0) {
      throw new PDFValidationError(`No valid pages specified. Document has ${totalPages} pages.`);
    }

    for (const index of pageIndices) {
      const page = pdfDoc.getPage(index);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + options.angle) % 360));
    }

    // Because we are modifying the document in place and not copying pages,
    // bookmarks, forms, and metadata are perfectly preserved!
    const rotatedBytes = await pdfDoc.save();
    const durationMs = Date.now() - startTime;
    
    logger?.info(`[${requestId}] Rotate completed successfully`, { 
      durationMs, 
      outputSize: rotatedBytes.length, 
      pages: pdfDoc.getPageCount() 
    });

    return {
      success: true,
      buffer: rotatedBytes,
      filename: `rotated-${Date.now()}.pdf`,
      mimeType: 'application/pdf',
      warnings: [],
      metadata: {
        pages: pdfDoc.getPageCount(),
        originalSize: file.size,
        outputSize: rotatedBytes.length,
        durationMs,
      }
    };
  } catch (error: any) {
    logger?.error(`[${requestId}] Rotate failed`, error);
    if (error.name === 'EncryptedPDFError' || error.name === 'CorruptPDFError' || error.name === 'PDFValidationError') {
      throw error;
    }
    throw new PDFEngineError(error.message || 'An unexpected error occurred during rotate.');
  }
}
