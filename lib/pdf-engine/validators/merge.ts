import { UploadedFile } from '../types';
import { PDFValidationError } from '../errors';

export function validateMergeFiles(files: UploadedFile[]): void {
  if (!files || files.length < 2) {
    throw new PDFValidationError('At least 2 PDF files are required for merging.');
  }

  for (const file of files) {
    if (file.mimeType !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new PDFValidationError(`File '${file.name}' is not a valid PDF.`);
    }
  }
}
