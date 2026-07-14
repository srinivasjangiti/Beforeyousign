import { NextRequest, NextResponse } from 'next/server';
import { pdfEngine } from '@/lib/pdf-engine/engine';
import { validateSplitFile } from '@/lib/pdf-engine/validators/split';
import { engineResultToResponse, handleEngineError } from '../_shared/engine-response';
import { UploadedFile, PDFLogger } from '@/lib/pdf-engine/types';

const consoleLogger: PDFLogger = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const rawFile = formData.get('file') as File;
    const pages = formData.get('pages') as string;

    // 1. Convert File to UploadedFile
    let uploadedFile: UploadedFile | undefined;
    if (rawFile instanceof File) {
      const arrayBuffer = await rawFile.arrayBuffer();
      uploadedFile = {
        name: rawFile.name,
        mimeType: rawFile.type,
        size: rawFile.size,
        buffer: new Uint8Array(arrayBuffer),
      };
    }

    // 2. Validate
    validateSplitFile(uploadedFile as UploadedFile, { pages });

    // 3. Execute
    const result = await pdfEngine.split({
      requestId: crypto.randomUUID(),
      files: [uploadedFile as UploadedFile],
      options: { pages },
      logger: consoleLogger,
    });

    // 4. Respond
    return engineResultToResponse(result);
  } catch (error) {
    return handleEngineError(error);
  }
}
