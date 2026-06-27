import { Loader2, CheckCircle2 } from 'lucide-react';
import { PDFTool } from './data';

interface ProgressCardProps {
  tool: PDFTool;
  stage: string;
}

export function ProgressCard({ tool, stage }: ProgressCardProps) {
  
  const getStageMessage = () => {
    switch(stage) {
      case 'preparing': return 'Preparing files...';
      case 'uploading': return 'Uploading to secure server...';
      case 'processing': return `Applying ${tool.name} algorithm...`;
      case 'downloading': return 'Preparing output for download...';
      case 'complete': return 'Complete!';
      default: return 'Processing...';
    }
  };

  const getProgressPercentage = () => {
    switch(stage) {
      case 'preparing': return 10;
      case 'uploading': return 40;
      case 'processing': return 75;
      case 'downloading': return 90;
      case 'complete': return 100;
      default: return 50;
    }
  };

  const progress = getProgressPercentage();

  return (
    <div className="bg-white border-2 border-stone-200 rounded-xl p-12 text-center max-w-2xl mx-auto shadow-sm animate-in fade-in zoom-in duration-300">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle 
            className="text-stone-100 stroke-current" 
            strokeWidth="8" 
            cx="50" cy="50" r="40" fill="transparent" 
          />
          <circle 
            className="text-stone-900 stroke-current transition-all duration-700 ease-out" 
            strokeWidth="8" 
            strokeLinecap="round" 
            cx="50" cy="50" r="40" fill="transparent" 
            strokeDasharray={`${progress * 2.51} 251.2`} 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-stone-900 mb-2">{getStageMessage()}</h3>
      <p className="text-stone-500 mb-6">
        Please don't close this window. {tool.metadata.estimatedTime} remaining.
      </p>

      <div className="flex justify-center gap-4 text-sm text-stone-400 font-medium">
        <span className={`flex items-center gap-1 transition-colors ${progress >= 40 ? 'text-stone-900' : ''}`}>
          <CheckCircle2 className="w-4 h-4" /> Uploaded
        </span>
        <span className="w-4 border-b-2 border-stone-200 self-center" />
        <span className={`flex items-center gap-1 transition-colors ${progress >= 90 ? 'text-stone-900' : ''}`}>
          <CheckCircle2 className="w-4 h-4" /> Processed
        </span>
      </div>
    </div>
  );
}
