import { NextResponse } from 'next/server';
import { EngineResult } from '@/lib/pdf-engine/types';
import {
  PDFValidationError,
  EncryptedPDFError,
  CorruptPDFError,
  UnsupportedPDFError,
} from '@/lib/pdf-engine/errors';

export function engineResultToResponse(result: EngineResult): NextResponse {
  if (!result.success || !result.buffer) {
    return NextResponse.json(
      { error: 'Engine failed to produce a valid PDF buffer.', warnings: result.warnings },
      { status: 500 }
    );
  }

  const response = new NextResponse(result.buffer, {
    status: 200,
    headers: {
      'Content-Type': result.mimeType,
      'Content-Disposition': `attachment; filename="${result.filename}"`,
    },
  });

  return response;
}

export function handleEngineError(error: unknown): NextResponse {
  console.error('PDF Engine encountered an error:', error);

  if (error instanceof PDFValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof EncryptedPDFError) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }

  if (error instanceof CorruptPDFError) {
    return NextResponse.json({ error: error.message }, { status: 415 });
  }

  if (error instanceof UnsupportedPDFError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  // Fallback for unknown errors
  const message = error instanceof Error ? error.message : 'An unexpected error occurred processing the PDF.';
  return NextResponse.json({ error: message }, { status: 500 });
}
