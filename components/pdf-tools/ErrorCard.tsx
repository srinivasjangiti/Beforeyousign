import { AlertCircle, RefreshCcw, ArrowLeft } from 'lucide-react';
import { PDFTool } from './data';

interface ErrorCardProps {
  tool: PDFTool;
  error: string;
  onRetry: () => void;
  onChangeTool: () => void;
}

export function ErrorCard({ tool, error, onRetry, onChangeTool }: ErrorCardProps) {
  return (
    <div className="bg-white border-2 border-red-200 rounded-xl p-12 text-center max-w-2xl mx-auto shadow-sm animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-stone-900 mb-2">Processing Failed</h3>
      <p className="text-stone-600 mb-6 font-medium">
        {error}
      </p>

      <div className="flex flex-col gap-4 max-w-sm mx-auto">
        <button 
          onClick={onRetry}
          className="flex items-center justify-center gap-2 w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again
        </button>

        <button 
          onClick={onChangeTool}
          className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-stone-200 hover:border-stone-400 hover:bg-stone-50 text-stone-700 rounded-xl font-semibold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Choose Another Tool
        </button>
      </div>
    </div>
  );
}
