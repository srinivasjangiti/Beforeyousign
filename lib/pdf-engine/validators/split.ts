import { UploadedFile, SplitOptions } from '../types';
import { PDFValidationError } from '../errors';

export function validateSplitFile(file: UploadedFile, options: SplitOptions): void {
  if (!file) {
    throw new PDFValidationError('A PDF file is required.');
  }

  if (file.mimeType !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new PDFValidationError('The uploaded file is not a valid PDF.');
  }

  if (!options.pages || options.pages.trim() === '') {
    throw new PDFValidationError('Page ranges are required.');
  }
}
