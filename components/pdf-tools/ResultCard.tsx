import { Download, RefreshCcw, ArrowLeft, CheckCircle } from 'lucide-react';
import { PDFTool } from './data';

interface ResultCardProps {
  tool: PDFTool;
  onReset: () => void;
  onProcessAnother: () => void;
}

export function ResultCard({ tool, onReset, onProcessAnother }: ResultCardProps) {
  return (
    <div className="bg-white border-2 border-stone-200 rounded-xl p-12 text-center max-w-2xl mx-auto shadow-sm animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 scale-in">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <h3 className="text-3xl font-bold text-stone-900 mb-2">Success!</h3>
      <p className="text-stone-500 mb-8 max-w-sm mx-auto">
        Your {tool.metadata.expectedOutput} document is ready. It has been processed securely and will be deleted from our servers in 1 hour.
      </p>

      <div className="flex flex-col gap-4 max-w-sm mx-auto">
        <button 
          className="flex items-center justify-center gap-2 w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Download className="w-5 h-5" />
          Download {tool.metadata.expectedOutput}
        </button>

        <button 
          onClick={onProcessAnother}
          className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-stone-200 hover:border-stone-400 hover:bg-stone-50 text-stone-700 rounded-xl font-semibold transition-all active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          Process Another File
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-stone-200">
        <button 
          onClick={onReset}
          className="text-stone-500 hover:text-stone-900 font-medium text-sm flex items-center justify-center gap-1 mx-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </button>
      </div>
    </div>
  );
}
