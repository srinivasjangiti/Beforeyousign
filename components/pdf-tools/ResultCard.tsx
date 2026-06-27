import { Download, RefreshCcw, ArrowLeft, CheckCircle } from 'lucide-react';
import { PDFTool } from './data';
import { safeDownload } from '@/lib/download-utils';

interface ResultCardProps {
  tool: PDFTool;
  blob: Blob;
  onReset: () => void;
  onProcessAnother: () => void;
}

export function ResultCard({ tool, blob, onReset, onProcessAnother }: ResultCardProps) {
  
  const handleDownload = () => {
    // Determine extension based on metadata or hardcode to tool output
    const ext = tool.id === 'pdf-to-jpg' ? 'zip' : 'pdf';
    const prefix = tool.capabilities?.api?.downloadFilenamePrefix || 'output';
    safeDownload(blob, `${prefix}-${Date.now()}.${ext}`);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white border-2 border-green-200 rounded-xl p-12 text-center max-w-2xl mx-auto shadow-sm animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-stone-900 mb-2">Success!</h3>
      <p className="text-stone-600 mb-8 font-medium">
        Your file has been successfully processed.
        <br/>
        <span className="text-sm font-normal text-stone-400">Size: {formatSize(blob.size)}</span>
      </p>

      <div className="flex flex-col gap-4 max-w-sm mx-auto">
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <Download className="w-5 h-5" />
          Download File
        </button>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <button 
            onClick={onProcessAnother}
            className="flex items-center justify-center gap-2 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Restart Tool
          </button>
          
          <button 
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-stone-200 hover:border-stone-400 text-stone-700 rounded-xl font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            All Tools
          </button>
        </div>
      </div>
    </div>
  );
}
