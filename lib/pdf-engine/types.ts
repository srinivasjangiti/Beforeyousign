export interface UploadedFile {
  name: string;
  mimeType: string;
  buffer: Uint8Array;
  size: number;
}

export interface PDFLogger {
  debug(msg: string, ...args: any[]): void;
  info(msg: string, ...args: any[]): void;
  warn(msg: string, ...args: any[]): void;
  error(msg: string, ...args: any[]): void;
}

export interface OperationContext<T> {
  requestId: string;
  files: UploadedFile[];
  options: T;
  logger?: PDFLogger;
  signal?: AbortSignal;
}

export interface EngineResult {
  success: boolean;
  buffer?: Uint8Array;
  filename: string;
  mimeType: string;
  warnings: string[];
  metadata?: {
    pages?: number;
    originalSize?: number;
    outputSize?: number;
    durationMs?: number;
  };
}

// Option interfaces for operations
export interface MergeOptions {
  sortType?: 'byFileName' | 'byDateModified' | 'byDateCreated' | 'orderProvided';
}

export interface SplitOptions {
  pages: string; // e.g. "1,3,5-7"
}

export interface RotateOptions {
  angle: number;
  pages?: string; // all or specific ranges
}

export interface ImageOptions {
  // auto-fit or A4 etc.
  format?: 'A4' | 'auto';
}

export interface PDFEngine {
  operations: {
    merge: { available: boolean; experimental: boolean; supportsBookmarks: boolean; supportsForms: boolean | 'flatten-only' };
    split: { available: boolean; experimental: boolean; supportsBookmarks: boolean; supportsForms: boolean | 'flatten-only' };
    rotate: { available: boolean; experimental: boolean; supportsBookmarks: boolean; supportsForms: boolean | 'flatten-only' };
    imageToPdf: { available: boolean; experimental: boolean; supportsBookmarks: boolean; supportsForms: boolean | 'flatten-only' };
  };
  merge(context: OperationContext<MergeOptions>): Promise<EngineResult>;
  split(context: OperationContext<SplitOptions>): Promise<EngineResult>;
  rotate(context: OperationContext<RotateOptions>): Promise<EngineResult>;
  imageToPdf(context: OperationContext<ImageOptions>): Promise<EngineResult>;
  optimize(context: OperationContext<any>): Promise<EngineResult>;
}
