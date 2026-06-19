'use client';

import { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'convert' | 'organize' | 'optimize' | 'edit' | 'security';
  popular?: boolean;
  premium?: boolean;
}

export default function PDFTools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const tools: PDFTool[] = [
    // Convert Tools
    {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      description: 'Convert PDF to editable Word documents',
      icon: FileType,
      category: 'convert',
      popular: true
    },
    {
      id: 'word-to-pdf',
      name: 'Word to PDF',
      description: 'Convert Word documents to PDF format',
      icon: FileText,
      category: 'convert',
      popular: true
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF to Excel',
      description: 'Extract tables from PDF to Excel spreadsheets',
      icon: Grid3x3,
      category: 'convert'
    },
    {
      id: 'excel-to-pdf',
      name: 'Excel to PDF',
      description: 'Convert Excel spreadsheets to PDF',
      icon: FileCode,
      category: 'convert'
    },
    {
      id: 'pdf-to-powerpoint',
      name: 'PDF to PowerPoint',
      description: 'Convert PDF to editable presentations',
      icon: Layers,
      category: 'convert'
    },
    {
      id: 'powerpoint-to-pdf',
      name: 'PowerPoint to PDF',
      description: 'Convert presentations to PDF format',
      icon: FileText,
      category: 'convert'
    },
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      description: 'Convert PDF pages to JPG images',
      icon: Image,
      category: 'convert',
      popular: true
    },
    {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      description: 'Convert images to PDF documents',
      icon: FileImage,
      category: 'convert',
      popular: true
    },

    // Organize Tools
    {
      id: 'merge-pdf',
      name: 'Merge PDF',
      description: 'Combine multiple PDFs into one document',
      icon: Merge,
      category: 'organize',
      popular: true
    },
    {
      id: 'split-pdf',
      name: 'Split PDF',
      description: 'Extract pages or split PDF into multiple files',
      icon: Scissors,
      category: 'organize',
      popular: true
    },
    {
      id: 'rotate-pdf',
      name: 'Rotate PDF',
      description: 'Rotate pages to correct orientation',
      icon: RotateCw,
      category: 'organize'
    },
    {
      id: 'organize-pdf',
      name: 'Organize PDF',
      description: 'Reorder, delete, or add pages',
      icon: Layers,
      category: 'organize'
    },
    {
      id: 'page-numbers',
      name: 'Page Numbers',
      description: 'Add page numbers to PDF documents',
      icon: Hash,
      category: 'organize'
    },

    // Optimize Tools
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      description: 'Reduce file size while maintaining quality',
      icon: Minimize2,
      category: 'optimize',
      popular: true
    },
    {
      id: 'repair-pdf',
      name: 'Repair PDF',
      description: 'Fix corrupted or damaged PDF files',
      icon: Wrench,
      category: 'optimize'
    },
    {
      id: 'ocr-pdf',
      name: 'OCR PDF',
      description: 'Extract text from scanned documents',
      icon: ScanText,
      category: 'optimize',
      premium: true
    },

    // Edit Tools
    {
      id: 'edit-pdf',
      name: 'Edit PDF',
      description: 'Add text, images, and shapes to PDF',
      icon: Edit3,
      category: 'edit',
      premium: true
    },
    {
      id: 'watermark-pdf',
      name: 'Watermark PDF',
      description: 'Add watermark to protect your documents',
      icon: Droplet,
      category: 'edit'
    },
    {
      id: 'sign-pdf',
      name: 'Sign PDF',
      description: 'Add signature to PDF documents',
      icon: Edit3,
      category: 'edit',
      popular: true
    },
    {
      id: 'extract-images',
      name: 'Extract Images',
      description: 'Extract all images from PDF',
      icon: Image,
      category: 'edit'
    },
    {
      id: 'extract-text',
      name: 'Extract Text',
      description: 'Extract all text content from PDF',
      icon: Type,
      category: 'edit'
    },

    // Security Tools
    {
      id: 'protect-pdf',
      name: 'Protect PDF',
      description: 'Add password protection to PDF',
      icon: Lock,
      category: 'security'
    },
    {
      id: 'unlock-pdf',
      name: 'Unlock PDF',
      description: 'Remove password from PDF',
      icon: Unlock,
      category: 'security'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', icon: Grid3x3 },
    { id: 'convert', name: 'Convert', icon: FileType },
    { id: 'organize', name: 'Organize', icon: Layers },
    { id: 'optimize', name: 'Optimize', icon: Minimize2 },
    { id: 'edit', name: 'Edit', icon: Edit3 },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setUploadedFiles([]);
    setResult(null);
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please select a file first');
      return;
    }

    setProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      
      // Determine API endpoint based on selected tool
      let endpoint = '';
      let requiresMultipleFiles = false;

      switch (selectedTool) {
        case 'merge-pdf':
          endpoint = '/api/pdf/merge';
          requiresMultipleFiles = true;
          uploadedFiles.forEach(file => formData.append('files', file));
          break;
        case 'split-pdf':
          endpoint = '/api/pdf/split';
          formData.append('file', uploadedFiles[0]);
          formData.append('pages', '1-3'); // Default split first 3 pages
          break;
        case 'compress-pdf':
          endpoint = '/api/pdf/compress';
          formData.append('file', uploadedFiles[0]);
          formData.append('quality', '75');
          break;
        case 'rotate-pdf':
          endpoint = '/api/pdf/rotate';
          formData.append('file', uploadedFiles[0]);
          formData.append('rotation', '90');
          formData.append('pages', 'all');
          break;
        case 'protect-pdf':
          endpoint = '/api/pdf/protect';
          formData.append('file', uploadedFiles[0]);
          formData.append('password', 'demo123');
          break;
        case 'pdf-to-jpg':
          endpoint = '/api/pdf/to-image';
          formData.append('file', uploadedFiles[0]);
          formData.append('format', 'jpeg');
          formData.append('quality', '90');
          break;
        case 'jpg-to-pdf':
          endpoint = '/api/pdf/from-image';
          uploadedFiles.forEach(file => formData.append('files', file));
          break;
        default:
          // For tools not yet implemented, show info
          endpoint = '/api/pdf/info';
          formData.append('file', uploadedFiles[0]);
      }

      if (requiresMultipleFiles && uploadedFiles.length < 2) {
        setError('This tool requires at least 2 files');
        setProcessing(false);
        return;
      }

      // Simulate progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress < 90) {
          setUploadProgress(progress);
        }
      }, 100);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Processing failed');
      }

      // Check if response is a file download or JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/pdf')) {
        // Download the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'processed.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setResult({
          success: true,
          message: 'File processed successfully! Download started.',
          filename: a.download,
        });
      } else {
        // JSON response
        const data = await response.json();
        setResult(data);
      }

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setProcessing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      convert: 'from-blue-600 to-cyan-600',
      organize: 'from-purple-600 to-pink-600',
      optimize: 'from-green-600 to-emerald-600',
      edit: 'from-orange-600 to-red-600',
      security: 'from-red-600 to-rose-600'
    };
    return colors[category as keyof typeof colors] || 'from-stone-600 to-stone-700';
  };

  const selectedToolData = tools.find(t => t.id === selectedTool);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-stone-900 text-white py-8 mb-6">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">PDF Tools</h1>
          <p className="text-stone-300">
            Merge, split, compress, convert, and edit your PDFs
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className={`bg-white border-2 rounded-lg p-4 text-left hover:shadow-md transition-all ${
                selectedTool === tool.id ? 'border-stone-900 shadow-md' : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${getCategoryColor(tool.category)} rounded-lg flex items-center justify-center mb-3`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-stone-900 mb-1 text-sm">{tool.name}</h3>
              <p className="text-xs text-stone-600">{tool.description}</p>
            </button>
          ))}
        </div>

        {/* Tool Workspace */}
        {selectedToolData && (
          <div className="bg-white border-2 border-stone-200 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(selectedToolData.category)} rounded-xl flex items-center justify-center`}>
                <selectedToolData.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-stone-900 mb-1">{selectedToolData.name}</h2>
                <p className="text-stone-600">{selectedToolData.description}</p>
              </div>
              {selectedToolData.premium && (
                <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold">
                  Premium Feature
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="border-2 border-stone-200 rounded-xl p-6 bg-stone-50 mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {selectedTool === 'merge-pdf' || selectedTool === 'jpg-to-pdf' 
                  ? 'Select Multiple Files'
                  : 'Select File'}
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                multiple={selectedTool === 'merge-pdf' || selectedTool === 'jpg-to-pdf'}
                accept={selectedTool?.includes('jpg') || selectedTool?.includes('png') ? 'image/*' : '.pdf'}
                className="block w-full text-sm text-stone-900 file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-2 file:border-stone-300 file:text-sm file:font-semibold
                  file:bg-stone-50 file:text-stone-700 hover:file:bg-stone-100 hover:file:border-stone-900
                  transition-all cursor-pointer"
              />
              {uploadedFiles.length > 0 && (
                <div className="mt-3 p-3 bg-white border border-stone-200 rounded-lg">
                  <p className="text-sm font-semibold text-stone-900 mb-1">Selected Files:</p>
                  <p className="text-sm text-stone-600">{uploadedFiles.map(f => f.name).join(', ')}</p>
                </div>
              )}
            </div>

            {/* Tool-specific Options */}
            {selectedTool === 'split-pdf' && (
              <div className="mb-4 p-4 bg-white border-2 border-stone-200 rounded-lg">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Page Range (e.g., 1-3,5,7-10)
                </label>
                <input
                  type="text"
                  placeholder="1-3"
                  className="w-full px-4 py-2 border-2 border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none"
                />
              </div>
            )}

            {selectedTool === 'rotate-pdf' && (
              <div className="mb-4 p-4 bg-white border-2 border-stone-200 rounded-lg">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Rotation Angle
                </label>
                <select className="w-full px-4 py-2 border-2 border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none">
                  <option value="90">90° Clockwise</option>
                  <option value="180">180°</option>
                  <option value="270">270° (90° Counter-clockwise)</option>
                </select>
              </div>
            )}

            {selectedTool === 'protect-pdf' && (
              <div className="mb-4 p-4 bg-white border-2 border-stone-200 rounded-lg">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full px-4 py-2 border-2 border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none"
                />
              </div>
            )}

            {selectedTool === 'compress-pdf' && (
              <div className="mb-4 p-4 bg-white border-2 border-stone-200 rounded-lg">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Compression Quality
                </label>
                <select className="w-full px-4 py-2 border-2 border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none">
                  <option value="50">High Compression (50%)</option>
                  <option value="75">Medium (75%)</option>
                  <option value="90">Low Compression (90%)</option>
                </select>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <X className="h-5 w-5" />
                  <span className="font-semibold">{error}</span>
                </div>
              </div>
            )}

            {/* Result Display */}
            {result && (
              <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <Check className="h-5 w-5" />
                  <span className="font-semibold">Success!</span>
                </div>
                <p className="text-sm text-green-700">
                  {result.message || JSON.stringify(result, null, 2)}
                </p>
              </div>
            )}

            {/* Process Button */}
            <button
              onClick={handleProcess}
              disabled={processing || uploadedFiles.length === 0}
              className="w-full py-3 px-6 bg-stone-900 text-white rounded-lg font-semibold
                hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed
                transition-all flex items-center justify-center gap-2 mb-6"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileCheck className="h-5 w-5" />
                  Process File
                </>
              )}
            </button>

            {/* Processing */}
            {processing && (
              <div className="bg-stone-50 border-2 border-stone-300 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-stone-900">Processing your file...</p>
                  <span className="text-stone-700 font-mono">{uploadProgress}%</span>
                </div>
                <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-stone-900 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
