import { useEffect, useState, useRef } from 'react';
import { PDFTool, WorkflowStep } from './data';
import { UploadZone } from './UploadZone';
import { ProgressCard } from './ProgressCard';
import { ResultCard } from './ResultCard';

interface WorkspaceProps {
  tool: PDFTool | null;
  step: WorkflowStep;
  setStep: (step: WorkflowStep) => void;
}

export function Workspace({ tool, step, setStep }: WorkspaceProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When tool changes, reset state and scroll to workspace
    if (tool) {
      setSelectedFiles([]);
      setStep('upload');
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setStep('choose');
    }
  }, [tool, setStep]);

  if (!tool) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 text-center text-stone-500 py-32 bg-stone-100/50 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center transition-all duration-300">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-10 h-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-stone-900 mb-3">Choose a tool to begin</h3>
        <p className="max-w-md mx-auto">Select any of the available PDF tools from the grid above to activate this workspace. No files are ever sent to external servers.</p>
      </div>
    );
  }

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    setStep('configure'); // Skip configure for now unless we add ToolOptions
  };

  const handleProcess = () => {
    setStep('process');
  };

  const handleComplete = () => {
    setStep('result');
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setStep('choose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessAnother = () => {
    setSelectedFiles([]);
    setStep('upload');
  };

  return (
    <div 
      key={tool.id}
      ref={containerRef}
      className="w-full max-w-7xl mx-auto mt-8 animate-in slide-in-from-bottom-4 fade-in duration-500 ease-out"
    >
      {/* Workspace Header */}
      <div className="bg-stone-900 text-white rounded-t-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/10 rounded-xl">
            <tool.icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">{tool.name}</h2>
            <p className="text-stone-300">{tool.metadata.description}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-6 text-sm text-stone-300 border-t border-white/10 pt-6">
          <div>
            <span className="block text-white/50 mb-1 text-xs uppercase tracking-wider font-bold">Supported Input</span>
            <span className="font-medium text-white">{tool.metadata.supportedInput}</span>
          </div>
          <div>
            <span className="block text-white/50 mb-1 text-xs uppercase tracking-wider font-bold">Output Format</span>
            <span className="font-medium text-white">{tool.metadata.expectedOutput}</span>
          </div>
          <div>
            <span className="block text-white/50 mb-1 text-xs uppercase tracking-wider font-bold">Avg. Processing Time</span>
            <span className="font-medium text-white">{tool.metadata.estimatedTime}</span>
          </div>
        </div>
      </div>

      {/* Workspace Body */}
      <div className="bg-white border-x-2 border-b-2 border-stone-200 rounded-b-2xl p-8 shadow-sm min-h-[400px]">
        {step === 'upload' && (
          <UploadZone 
            tool={tool} 
            selectedFiles={selectedFiles}
            onFilesSelected={handleFilesSelected} 
            onRemoveFile={(idx) => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
          />
        )}

        {step === 'configure' && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <h3 className="text-xl font-bold mb-8">Ready to Process</h3>
            <UploadZone 
              tool={tool} 
              selectedFiles={selectedFiles}
              onFilesSelected={handleFilesSelected} 
              onRemoveFile={(idx) => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
            />
            <button 
              onClick={handleProcess}
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              {tool.metadata.ctaText}
            </button>
          </div>
        )}

        {step === 'process' && (
          <ProgressCard tool={tool} onComplete={handleComplete} />
        )}

        {step === 'result' && (
          <ResultCard tool={tool} onReset={handleReset} onProcessAnother={handleProcessAnother} />
        )}
      </div>
    </div>
  );
}
