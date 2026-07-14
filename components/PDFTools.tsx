'use client';

import { useState } from 'react';
import { ToolGrid } from './pdf-tools/ToolGrid';
import { Workspace } from './pdf-tools/Workspace';
import { TOOLS, WorkflowStep } from './pdf-tools/data';

export default function PDFTools() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [step, setStep] = useState<WorkflowStep>('choose');

  const selectedTool = TOOLS.find(t => t.id === selectedToolId) || null;

  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
    setStep('upload');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBack = () => {
    setSelectedToolId(null);
    setStep('choose');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedTool ? (
          <div>
            <div className="mb-8 border-b border-stone-200 pb-6">
              <h1 className="text-3xl font-bold text-stone-900 mb-2">PDF Tools</h1>
              <p className="text-stone-500">Secure, commercial-grade tools for document processing.</p>
            </div>
            <ToolGrid 
              selectedTool={selectedToolId} 
              onToolSelect={handleToolSelect} 
            />
          </div>
        ) : (
          <Workspace 
            tool={selectedTool} 
            step={step}
            setStep={setStep}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
