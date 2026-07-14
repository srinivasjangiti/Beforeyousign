export class PDFEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PDFEngineError';
  }
}

export class PDFValidationError extends PDFEngineError {
  constructor(message: string) {
    super(message);
    this.name = 'PDFValidationError';
  }
}

export class UnsupportedPDFError extends PDFEngineError {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedPDFError';
  }
}

export class EncryptedPDFError extends PDFEngineError {
  constructor(message: string = 'PDF file is encrypted and cannot be processed') {
    super(message);
    this.name = 'EncryptedPDFError';
  }
}

export class CorruptPDFError extends PDFEngineError {
  constructor(message: string = 'PDF file is corrupt or invalid') {
    super(message);
    this.name = 'CorruptPDFError';
  }
}
