import { PDFDocument } from 'pdf-lib';
import { OperationContext, SplitOptions, EngineResult } from '../types';
import { EncryptedPDFError, CorruptPDFError, PDFValidationError, PDFEngineError } from '../errors';
import { parsePageRanges } from '../utils/pageRanges';

export async function executeSplit(
  context: OperationContext<SplitOptions>
): Promise<EngineResult> {
  const { files, options, logger, requestId } = context;
  const startTime = Date.now();
  const file = files[0];
  
  logger?.info(`[${requestId}] Starting split operation`, { fileName: file.name, options });

  try {
    let pdfDoc: PDFDocument;
    
    try {
      pdfDoc = await PDFDocument.load(file.buffer, { ignoreEncryption: false });
    } catch (err: any) {
      if (err.message?.includes('encrypted') || err.name === 'EncryptedPDFError') {
        throw new EncryptedPDFError(`The PDF '${file.name}' is encrypted. Unlock it first before splitting.`);
      }
      throw new CorruptPDFError(`The PDF file '${file.name}' is corrupted or invalid.`);
    }

    const totalPages = pdfDoc.getPageCount();
    const pageIndices = parsePageRanges(options.pages, totalPages);

    if (pageIndices.length === 0) {
      throw new PDFValidationError(`No valid pages found in range. The document has ${totalPages} pages.`);
    }

    // Explicitly flatten forms before copying to prevent visual corruption or loss of fields
    const form = pdfDoc.getForm();
    const warnings: string[] = [];
    if (form) {
      try {
        form.flatten();
      } catch (e: any) {
        warnings.push(`Failed to flatten form fields in '${file.name}'. Appearance may be lost.`);
        logger?.warn(`[${requestId}] Failed to flatten forms for ${file.name}`, e);
      }
    }

    const newPdf = await PDFDocument.create();
    
    // Attempt to preserve metadata
    newPdf.setTitle(pdfDoc.getTitle() || '');
    newPdf.setAuthor(pdfDoc.getAuthor() || '');
    newPdf.setSubject(pdfDoc.getSubject() || '');
    newPdf.setCreator(pdfDoc.getCreator() || '');

    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const newPdfBytes = await newPdf.save();
    const durationMs = Date.now() - startTime;
    
    logger?.info(`[${requestId}] Split completed successfully`, { 
      durationMs, 
      outputSize: newPdfBytes.length, 
      pages: newPdf.getPageCount() 
    });

    return {
      success: true,
      buffer: newPdfBytes,
      filename: `split-${Date.now()}.pdf`,
      mimeType: 'application/pdf',
      warnings,
      metadata: {
        pages: newPdf.getPageCount(),
        originalSize: file.size,
        outputSize: newPdfBytes.length,
        durationMs,
      }
    };
  } catch (error: any) {
    logger?.error(`[${requestId}] Split failed`, error);
    if (error.name === 'EncryptedPDFError' || error.name === 'CorruptPDFError' || error.name === 'PDFValidationError') {
      throw error;
    }
    throw new PDFEngineError(error.message || 'An unexpected error occurred during split.');
  }
}
