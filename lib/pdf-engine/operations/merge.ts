import { PDFDocument } from 'pdf-lib';
import { OperationContext, MergeOptions, EngineResult, UploadedFile } from '../types';
import { EncryptedPDFError, CorruptPDFError, PDFEngineError } from '../errors';

export async function executeMerge(
  context: OperationContext<MergeOptions>
): Promise<EngineResult> {
  const { files, options, logger, requestId } = context;
  const startTime = Date.now();
  let originalSize = 0;
  
  logger?.info(`[${requestId}] Starting merge operation`, { fileCount: files.length, options });

  try {
    // 1. Reorder files if necessary based on options
    const sortedFiles = [...files];
    if (options.sortType === 'byFileName') {
      sortedFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    } else if (options.sortType === 'byDateModified' || options.sortType === 'byDateCreated') {
      // PDF dates extraction via pdf-lib is costly as it requires loading each doc entirely.
      // For a native implementation lacking direct OS stat access (since we only get buffers), 
      // we'd need to parse XMP or DocumentInformation here.
      // As a simplification for now, we leave as-is and log a warning if requested.
      logger?.warn(`[${requestId}] Sorting by date is currently unsupported natively from buffer uploads. Using original order.`);
    }

    const mergedPdf = await PDFDocument.create();
    const warnings: string[] = [];

    // 2. Process each file
    for (const file of sortedFiles) {
      originalSize += file.size;
      let pdf: PDFDocument;

      try {
        pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: false });
      } catch (err: any) {
        if (err.message?.includes('encrypted') || err.name === 'EncryptedPDFError') {
          throw new EncryptedPDFError(`File '${file.name}' is encrypted and cannot be merged.`);
        }
        throw new CorruptPDFError(`File '${file.name}' is corrupted or invalid.`);
      }

      // We explicitly flatten forms before copying to prevent visual corruption 
      // or loss of fields during merge. 
      const form = pdf.getForm();
      if (form) {
        try {
          form.flatten();
        } catch (e: any) {
          warnings.push(`Failed to flatten form fields in '${file.name}'. Appearance may be lost.`);
          logger?.warn(`[${requestId}] Failed to flatten forms for ${file.name}`, e);
        }
      }

      // Copy pages
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // 3. Save the merged document
    const mergedPdfBytes = await mergedPdf.save();
    const durationMs = Date.now() - startTime;
    
    logger?.info(`[${requestId}] Merge completed successfully`, { 
      durationMs, 
      outputSize: mergedPdfBytes.length, 
      pages: mergedPdf.getPageCount() 
    });

    return {
      success: true,
      buffer: mergedPdfBytes,
      filename: `merged-${Date.now()}.pdf`,
      mimeType: 'application/pdf',
      warnings,
      metadata: {
        pages: mergedPdf.getPageCount(),
        originalSize,
        outputSize: mergedPdfBytes.length,
        durationMs,
      }
    };
  } catch (error: any) {
    logger?.error(`[${requestId}] Merge failed`, error);
    if (error.name === 'EncryptedPDFError' || error.name === 'CorruptPDFError' || error.name === 'PDFValidationError') {
      throw error;
    }
    throw new PDFEngineError(error.message || 'An unexpected error occurred during merge.');
  }
}
