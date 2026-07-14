import { PDFEngine, EngineResult, MergeOptions, SplitOptions, RotateOptions, ImageOptions, OperationContext } from './types';
import { executeMerge } from './operations/merge';
import { executeSplit } from './operations/split';
import { executeRotate } from './operations/rotate';
import { executeImageToPdf } from './operations/image';

export class PdfLibEngine implements PDFEngine {
  public operations = {
    merge: {
      available: true,
      experimental: false,
      supportsBookmarks: false,
      supportsForms: 'flatten-only' as const,
    },
    split: {
      available: true,
      experimental: false,
      supportsBookmarks: false,
      supportsForms: 'flatten-only' as const,
    },
    rotate: {
      available: true,
      experimental: false,
      supportsBookmarks: true,
      supportsForms: true,
    },
    imageToPdf: {
      available: true,
      experimental: false,
      supportsBookmarks: false,
      supportsForms: false,
    }
  };

  async merge(context: OperationContext<MergeOptions>): Promise<EngineResult> {
    return executeMerge(context);
  }

  async split(context: OperationContext<SplitOptions>): Promise<EngineResult> {
    return executeSplit(context);
  }

  async rotate(context: OperationContext<RotateOptions>): Promise<EngineResult> {
    return executeRotate(context);
  }

  async imageToPdf(context: OperationContext<ImageOptions>): Promise<EngineResult> {
    return executeImageToPdf(context);
  }

  async optimize(context: OperationContext<any>): Promise<EngineResult> {
    throw new Error('Optimize is not supported in the PdfLibEngine natively.');
  }
}

export const pdfEngine = new PdfLibEngine();
