import { Loader2, FileCheck, CheckCircle2 } from 'lucide-react';
import { PDFTool } from './data';
import { useEffect, useState } from 'react';

interface ProgressCardProps {
  tool: PDFTool;
  onComplete: () => void;
}

export function ProgressCard({ tool, onComplete }: ProgressCardProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Uploading document...');

  // Simulate progress
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
      
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress < 30) setStatus('Uploading document...');
      else if (currentProgress < 60) setStatus('Processing document structure...');
      else if (currentProgress < 85) setStatus(`Applying ${tool.name} algorithm...`);
      else setStatus('Finalizing output...');

    }, 500);

    return () => clearInterval(interval);
  }, [tool, onComplete]);

  return (
    <div className="bg-white border-2 border-stone-200 rounded-xl p-12 text-center max-w-2xl mx-auto shadow-sm">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle 
            className="text-stone-100 stroke-current" 
            strokeWidth="8" 
            cx="50" cy="50" r="40" fill="transparent" 
          />
          <circle 
            className="text-stone-900 stroke-current transition-all duration-300 ease-out" 
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
      
      <h3 className="text-2xl font-bold text-stone-900 mb-2">{status}</h3>
      <p className="text-stone-500 mb-6">
        Please don't close this window. {tool.metadata.estimatedTime} remaining.
      </p>

      <div className="flex justify-center gap-4 text-sm text-stone-400 font-medium">
        <span className={`flex items-center gap-1 ${progress >= 30 ? 'text-stone-900' : ''}`}>
          <CheckCircle2 className="w-4 h-4" /> Uploaded
        </span>
        <span className="w-4 border-b-2 border-stone-200 self-center" />
        <span className={`flex items-center gap-1 ${progress >= 85 ? 'text-stone-900' : ''}`}>
          <CheckCircle2 className="w-4 h-4" /> Processed
        </span>
      </div>
    </div>
  );
}
