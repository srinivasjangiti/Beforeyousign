import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { PDFTool } from './data';

interface UploadZoneProps {
  tool: PDFTool;
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
}

export function UploadZone({ tool, onFilesSelected, selectedFiles, onRemoveFile }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  }, [onFilesSelected]);

  if (selectedFiles.length > 0) {
    return (
      <div className="bg-white border-2 border-stone-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-stone-900 mb-4">Selected Files</h3>
        <div className="space-y-3">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-stone-200 rounded-lg">
                  <FileText className="w-6 h-6 text-stone-700" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                  <p className="text-xs text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => onRemoveFile(idx)}
                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <label className="cursor-pointer px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-colors text-sm">
            Add More Files
            <input 
              type="file" 
              className="hidden" 
              multiple 
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 relative group
        ${isDragging 
          ? 'border-stone-900 bg-stone-100 scale-[1.01]' 
          : 'border-stone-300 bg-stone-50 hover:border-stone-400 hover:bg-stone-100'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-stone-900/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-200 group-hover:scale-110 transition-transform duration-300">
        <Upload className={`w-10 h-10 ${isDragging ? 'text-stone-900' : 'text-stone-400'}`} />
      </div>
      
      <h3 className="text-2xl font-bold text-stone-900 mb-2">{tool.metadata.title}</h3>
      <p className="text-stone-500 mb-8 max-w-sm mx-auto">
        Drag and drop your files here, or click the button below to browse your computer.
      </p>

      <label className="cursor-pointer inline-flex items-center justify-center px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all active:scale-95">
        Choose Files
        <input 
          type="file" 
          className="hidden" 
          multiple 
          onChange={handleFileInput}
        />
      </label>

      <div className="mt-8 pt-6 border-t border-stone-200/60 max-w-md mx-auto flex justify-between text-xs text-stone-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Max size: 50MB
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Supports: {tool.metadata.supportedInput}
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Encrypted transfers
        </span>
      </div>
    </div>
  );
}
