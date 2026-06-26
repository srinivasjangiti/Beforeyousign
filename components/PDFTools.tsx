'use client';

import { useState } from 'react';
import { WorkflowStepper } from './pdf-tools/WorkflowStepper';
import { ToolGrid } from './pdf-tools/ToolGrid';
import { Workspace } from './pdf-tools/Workspace';
import { TOOLS, PDFTool, WorkflowStep } from './pdf-tools/data';
import { FileText } from 'lucide-react';

export default function PDFTools() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [step, setStep] = useState<WorkflowStep>('choose');
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const selectedTool = TOOLS.find(t => t.id === selectedToolId) || null;

  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
    setStep('upload');
    const tool = TOOLS.find(t => t.id === toolId);
    if (tool) {
      showToast(`✓ ${tool.name} selected. Upload your file below.`);
    }
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 relative overflow-hidden">
      {/* Toast Notification */}
      <div className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300
        ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}
      `}>
        <div className="bg-stone-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium">
          {toast.message}
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-stone-900 text-white py-16 mb-12 relative">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 to-stone-900"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">PDF Tools</h1>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            A complete suite of secure, high-performance tools to merge, compress, convert, and edit your PDF documents.
          </p>
        </div>
      </div>

      {/* Main Flow */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8 relative pb-24">
        <div className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-sm pt-4 pb-4 border-b border-stone-200/50 mb-4 -mx-6 px-6 shadow-sm">
          <WorkflowStepper currentStep={step} />
        </div>
        
        {/* Tool Selection Grid */}
        <div className={`transition-all duration-300 ${selectedToolId ? 'opacity-80 hover:opacity-100' : 'opacity-100'}`}>
          <ToolGrid 
            selectedTool={selectedToolId} 
            onToolSelect={handleToolSelect} 
          />
        </div>

        {/* Dynamic Workspace */}
        <div className="transition-all duration-500 ease-in-out">
          <Workspace 
            tool={selectedTool} 
            step={step}
            setStep={setStep}
          />
        </div>
      </div>
    </div>
  );
}
