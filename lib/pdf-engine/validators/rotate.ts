import { UploadedFile, RotateOptions } from '../types';
import { PDFValidationError } from '../errors';

export function validateRotateFile(file: UploadedFile, options: RotateOptions): void {
  if (!file) {
    throw new PDFValidationError('A PDF file is required.');
  }

  if (file.mimeType !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new PDFValidationError('The uploaded file is not a valid PDF.');
  }

  if (options.angle === undefined || isNaN(options.angle)) {
    throw new PDFValidationError('A valid rotation angle is required.');
  }
}
