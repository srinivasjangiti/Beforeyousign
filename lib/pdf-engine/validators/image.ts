import { UploadedFile } from '../types';
import { PDFValidationError } from '../errors';

export function validateImageFiles(files: UploadedFile[]): void {
  if (!files || files.length === 0) {
    throw new PDFValidationError('At least one image file is required.');
  }

  for (const file of files) {
    if (!file.mimeType.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      throw new PDFValidationError(`File '${file.name}' is not a valid image.`);
    }
  }
}
