import {
  FileText,
  Scissors,
  Merge,
  Minimize2,
  FileType,
  Image,
  Shield,
  Lock,
  Unlock,
  RotateCw,
  Layers,
  Hash,
  Edit3,
  Download,
  Upload,
  Check,
  Droplet,
  Grid3x3,
  Eye,
  Settings,
  Zap,
  Sparkles,
  FileImage,
  FileCode,
  Wrench,
  ScanText,
  FileCheck,
  Loader2,
  Star,
  X,
  Type,
  Palette,
  ArrowRight,
  Clock,
  LucideIcon
} from 'lucide-react';

export type ToolCategory = 'convert' | 'organize' | 'optimize' | 'edit' | 'security';
export type WorkflowStep = 'choose' | 'upload' | 'configure' | 'process' | 'result';

export interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  popular?: boolean;
  premium?: boolean;
  comingSoon?: boolean;
  metadata: {
    title: string;
    description: string;
    supportedInput: string;
    expectedOutput: string;
    estimatedTime: string;
    ctaText: string;
  };
  capabilities?: {
    implemented: boolean;
    upload: boolean;
    download: boolean;
    configurable: boolean;
    multipleFiles: boolean;
    preview: boolean;
  };
  api?: {
    endpoint: string;
    method: 'POST' | 'GET';
    acceptedTypes: string; // e.g. 'application/pdf'
    responseType: 'blob' | 'json';
    downloadFilenamePrefix: string;
  };
}

export const CATEGORIES = [
  { id: 'convert', name: 'Convert PDF' },
  { id: 'organize', name: 'Organize PDF' },
  { id: 'optimize', name: 'Optimize PDF' },
  { id: 'edit', name: 'Edit PDF' },
  { id: 'security', name: 'PDF Security' }
];

export const TOOLS: PDFTool[] = [
  // Convert Tools
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF to editable Word documents',
    icon: FileType,
    category: 'convert',
    popular: true,
    comingSoon: true,
    metadata: {
      title: 'Upload PDF',
      description: 'Convert PDF documents into editable DOCX files.',
      supportedInput: 'PDF',
      expectedOutput: 'DOCX',
      estimatedTime: '2–5 seconds',
      ctaText: 'Convert to Word'
    }
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Word documents to PDF format',
    icon: FileText,
    category: 'convert',
    popular: true,
    comingSoon: true,
    metadata: {
      title: 'Upload Word Document',
      description: 'Convert Word documents (DOCX/DOC) into static PDF format.',
      supportedInput: 'DOCX, DOC',
      expectedOutput: 'PDF',
      estimatedTime: '2–5 seconds',
      ctaText: 'Convert to PDF'
    }
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Extract tables from PDF to Excel spreadsheets',
    icon: Grid3x3,
    category: 'convert',
    comingSoon: true,
    metadata: {
      title: 'Upload PDF',
      description: 'Extract tables and data from PDF into Excel spreadsheets.',
      supportedInput: 'PDF',
      expectedOutput: 'XLSX',
      estimatedTime: '5–10 seconds',
      ctaText: 'Convert to Excel'
    }
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF',
    icon: FileCode,
    category: 'convert',
    comingSoon: true,
    metadata: {
      title: 'Upload Excel Spreadsheet',
      description: 'Convert Excel spreadsheets into printable PDF documents.',
      supportedInput: 'XLSX, XLS',
      expectedOutput: 'PDF',
      estimatedTime: '3–6 seconds',
      ctaText: 'Convert to PDF'
    }
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    description: 'Convert PDF to editable presentations',
    icon: Layers,
    category: 'convert',
    comingSoon: true,
    metadata: {
      title: 'Upload PDF',
      description: 'Convert PDF pages into editable PowerPoint slides.',
      supportedInput: 'PDF',
      expectedOutput: 'PPTX',
      estimatedTime: '5–10 seconds',
      ctaText: 'Convert to PowerPoint'
    }
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    description: 'Convert presentations to PDF format',
    icon: FileText,
    category: 'convert',
    comingSoon: true,
    metadata: {
      title: 'Upload PowerPoint Presentation',
      description: 'Convert presentation slides into a static PDF document.',
      supportedInput: 'PPTX, PPT',
      expectedOutput: 'PDF',
      estimatedTime: '3–6 seconds',
      ctaText: 'Convert to PDF'
    }
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert PDF pages to JPG images',
    icon: Image,
    category: 'convert',
    popular: true,
    comingSoon: true,
    metadata: {
      title: 'Upload PDF',
      description: 'Extract all pages from a PDF and convert them into high-quality JPG images.',
      supportedInput: 'PDF',
      expectedOutput: 'JPG (ZIP)',
      estimatedTime: '2–4 seconds',
      ctaText: 'Convert to JPG'
    },
    capabilities: { implemented: false, upload: true, download: true, configurable: true, multipleFiles: false, preview: false }
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert images to PDF documents',
    icon: FileImage,
    category: 'convert',
    popular: true,
    metadata: {
      title: 'Upload Images',
      description: 'Combine multiple JPG or PNG images into a single PDF document.',
      supportedInput: 'JPG, PNG',
      expectedOutput: 'PDF',
      estimatedTime: '1–3 seconds',
      ctaText: 'Convert to PDF'
    },
    capabilities: { implemented: true, upload: true, download: true, configurable: true, multipleFiles: true, preview: false },
    api: { endpoint: '/api/pdf/from-image', method: 'POST', acceptedTypes: 'image/jpeg, image/png', responseType: 'blob', downloadFilenamePrefix: 'images-to-pdf' }
  },

  // Organize Tools
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into a single document',
    icon: Merge,
    category: 'organize',
    popular: true,
    metadata: {
      title: 'Upload Multiple PDFs',
      description: 'Merge multiple PDF files into one combined document.',
      supportedInput: 'Multiple PDFs',
      expectedOutput: 'PDF',
      estimatedTime: '1–3 seconds',
      ctaText: 'Merge PDFs'
    },
    capabilities: { implemented: true, upload: true, download: true, configurable: false, multipleFiles: true, preview: false },
    api: { endpoint: '/api/pdf/merge', method: 'POST', acceptedTypes: 'application/pdf', responseType: 'blob', downloadFilenamePrefix: 'merged' }
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion',
    icon: Scissors,
    category: 'organize',
    popular: true,
    metadata: {
      title: 'Upload PDF to Split',
      description: 'Extract specific pages or split a document into multiple files.',
      supportedInput: 'PDF',
      expectedOutput: 'PDF (ZIP)',
      estimatedTime: '2–4 seconds',
      ctaText: 'Split PDF'
    },
    capabilities: { implemented: true, upload: true, download: true, configurable: true, multipleFiles: false, preview: false },
    api: { endpoint: '/api/pdf/split', method: 'POST', acceptedTypes: 'application/pdf', responseType: 'blob', downloadFilenamePrefix: 'split' }
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate your PDFs the way you need them',
    icon: RotateCw,
    category: 'organize',
    metadata: {
      title: 'Upload PDF to Rotate',
      description: 'Rotate specific pages or the entire document by 90, 180, or 270 degrees.',
      supportedInput: 'PDF',
      expectedOutput: 'PDF',
      estimatedTime: '1–2 seconds',
      ctaText: 'Rotate PDF'
    },
    capabilities: { implemented: true, upload: true, download: true, configurable: true, multipleFiles: false, preview: false },
    api: { endpoint: '/api/pdf/rotate', method: 'POST', acceptedTypes: 'application/pdf', responseType: 'blob', downloadFilenamePrefix: 'rotated' }
  },
  {
    id: 'page-numbers',
    name: 'Page Numbers',
    description: 'Add page numbers into PDFs with ease',
    icon: Hash,
    category: 'organize',
    comingSoon: true,
    metadata: {
      title: 'Upload PDF',
      description: 'Insert customizable page numbers into your PDF document.',
      supportedInput: 'PDF',
      expectedOutput: 'PDF',
      estimatedTime: '1–3 seconds',
      ctaText: 'Add Page Numbers'
    },
    capabilities: { implemented: false, upload: true, download: true, configurable: true, multipleFiles: false, preview: false }
  },

  // Optimize Tools
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality',
    icon: Minimize2,
    category: 'optimize',
    popular: true,
    metadata: {
      title: 'Upload PDF to Compress',
      description: 'Reduce the file size of your PDF while maintaining maximum quality.',
      supportedInput: 'PDF',
      expectedOutput: 'PDF (Optimized)',
      estimatedTime: '3–8 seconds',
      ctaText: 'Compress PDF'
    },
    capabilities: { implemented: true, upload: true, download: true, configurable: true, multipleFiles: false, preview: false },
    api: { endpoint: '/api/pdf/compress', method: 'POST', acceptedTypes: 'application/pdf', responseType: 'blob', downloadFilenamePrefix: 'compressed' }
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    description: 'Fix corrupted or damaged PDF files',
    icon: Wrench,
    category: 'optimize',
    comingSoon: true,
    metadata: {
      title: 'Upload Corrupted PDF',
      description: 'Attempt to recover and repair a corrupted or damaged PDF file.',
      supportedInput: 'PDF',
      expectedOutput: 'PDF',
      estimatedTime: '5–15 seconds',
      ctaText: 'Repair PDF'
    }
  },
  {
    id: 'ocr-pdf',
    name: 'OCR PDF',
    description: 'Extract text from scanned documents',
    icon: ScanText,
    category: 'optimize',
    premium: true,
    comingSoon: true,
    metadata: {
      title: 'Upload Scanned Document',
      description: 'Make text in scanned PDFs selectable and searchable using OCR.',
      supportedInput: 'PDF (Scanned), Images',
      expectedOutput: 'PDF (Searchable)',
      estimatedTime: '10–30 seconds',
      ctaText: 'Apply OCR'
    }
  },

  // Edit Tools
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    description: 'Add text, images, and shapes to PDF',
    icon: Edit3,
    category: 'edit',
    premium: true,
    comingSoon: true,
    metadata: {
      title: 'Upload PDF to Edit',
      description: 'Directly modify text, add shapes, or insert images into your PDF.',
      supportedInput: 'PDF',
      expectedOutput: 'PDF',
      estimatedTime: 'Real-time',
      ctaText: 'Open Editor'
    }
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    description: 'Add watermark to protect your documents',
    icon: Droplet,
    category: 'edit',
    comingSoon: true,
    metadata: {
      title: 'Upload PDF',
      description: 'Overlay a text or image watermark onto your PDF pages.',
      supportedInput: 'PDF',
      expectedOutput: 'PDF',
      estimatedTime: '2–4 seconds',
      ctaText: 'Add Watermark'
    }
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    description: 'Add signature to PDF documents',
    icon: Edit3,
    category: 'edit',
    popular: true,
    comingSoon: true,
    metadata: {
      title: 'Upload PDF to Sign',
      description: 'Place your electronic signature on the document.',
      supportedInput: 'PDF',
      expectedOutput: 'PDF (Signed)',
      estimatedTime: 'Real-time',
      ctaText: 'Sign Document'
    }
  },
  {
    id: 'extract-images',
    name: 'Extract Images',
    description: 'Extract all images from PDF',
    icon: Image,
    category: 'edit',
    comingSoon: true,
    metadata: {
      title: 'Upload PDF',
      description: 'Extract all embedded images from the PDF document.',
      supportedInput: 'PDF',
      expectedOutput: 'Images (ZIP)',
      estimatedTime: '3–6 seconds',
      ctaText: 'Extract Images'
    }
  },
  {
    id: 'extract-text',
    name: 'Extract Text',
    description: 'Extract raw text from PDF documents',
    icon: FileText,
    category: 'edit',
    metadata: {
      title: 'Upload PDF',
      description: 'Extract plain text from the PDF document.',
      supportedInput: 'PDF',
      expectedOutput: 'TXT',
      estimatedTime: '2–5 seconds',
      ctaText: 'Extract Text'
    }
  },

  // Security Tools
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Encrypt your PDF with a password',
    icon: Lock,
    category: 'security',
    popular: true,
    metadata: {
      title: 'Upload PDF to Protect',
      description: 'Add a password and encrypt your PDF file to prevent unauthorized access.',
      supportedInput: 'PDF',
      expectedOutput: 'PDF (Encrypted)',
      estimatedTime: '1–3 seconds',
      ctaText: 'Protect PDF'
    },
    capabilities: { implemented: false, upload: true, download: true, configurable: true, multipleFiles: false, preview: false }
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove password from PDF files',
    icon: Unlock,
    category: 'security',
    metadata: {
      title: 'Upload Encrypted PDF',
      description: 'Remove the password protection from a PDF (requires the original password).',
      supportedInput: 'PDF (Encrypted)',
      expectedOutput: 'PDF (Unlocked)',
      estimatedTime: '1–3 seconds',
      ctaText: 'Unlock PDF'
    }
  },
  {
    id: 'redact-pdf',
    name: 'Redact PDF',
    description: 'Permanently remove sensitive information',
    icon: Shield,
    category: 'security',
    premium: true,
    comingSoon: true,
    metadata: {
      title: 'Upload PDF to Redact',
      description: 'Black out and permanently remove sensitive text or images from the document.',
      supportedInput: 'PDF',
      expectedOutput: 'PDF (Redacted)',
      estimatedTime: 'Real-time',
      ctaText: 'Open Redaction Tool'
    }
  }
];
