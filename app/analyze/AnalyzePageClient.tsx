'use client';

import { useState, useRef, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import AnalysisResult from '@/components/AnalysisResult';
import { ContractAnalysis } from '@/lib/types';
import { Loader2, Shield, Lock, CheckCircle } from 'lucide-react';

export default function AnalyzePageClient() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState<string>('');
  const [streamingText, setStreamingText] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal to bottom as AI output streams in
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [streamingText]);

  const handleFileSelect = async (file: File, jurisdiction: string) => {
    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);
    setStreamingText('');
    setStatusMessage('Starting analysis...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jurisdiction', jurisdiction);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.body) {
        throw new Error('No response stream received from server');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Split on SSE double-newline boundaries
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
          const dataLine = event.split('\n').find(l => l.startsWith('data: '));
          if (!dataLine) continue;

          let data: { type: string; [key: string]: unknown } | null = null;
          try {
            data = JSON.parse(dataLine.slice(6));
          } catch {
            continue; // Skip malformed SSE events
          }
          if (!data) continue;

          switch (data.type) {
            case 'status':
              setStatusMessage(data.message as string);
              break;
            case 'chunk':
              setStreamingText(prev => prev + (data!.content as string));
              break;
            case 'done':
              setAnalysis(data.analysis as ContractAnalysis);
              setIsAnalyzing(false);
              setStreamingText('');
              setStatusMessage('');
              break;
            case 'error':
              throw new Error((data.error as string) || 'Analysis failed');
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
      setStreamingText('');
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError('');
    setStreamingText('');
    setStatusMessage('');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Actions */}
      {analysis && (
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-medium text-stone-900 bg-white border border-stone-300 hover:border-stone-900 hover:bg-stone-50 transition-all"
              >
                New Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={analysis ? 'max-w-[1600px] w-full mx-auto px-4 lg:px-8 py-8' : 'max-w-7xl mx-auto px-8 py-16'}>
        {/* Upload State */}
        {!analysis && !isAnalyzing && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-stone-900 mb-4">
                Upload Your Contract
              </h1>
              <p className="text-lg text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
                Submit your contract for comprehensive analysis. Our AI will identify risks,
                translate complex provisions, and provide strategic recommendations.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 text-stone-500">
                <Shield className="w-4 h-4 text-stone-700" />
                <span className="text-sm">Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <Lock className="w-4 h-4 text-stone-700" />
                <span className="text-sm">Data Not Stored</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <div className="w-4 h-4 bg-stone-900 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">AI</span>
                </div>
                <span className="text-sm">Llama 3.1 8B Instruct</span>
              </div>
            </div>

            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={false} />
          </div>
        )}

        {/* Streaming Loading State */}
        {isAnalyzing && (
          <div className="max-w-3xl mx-auto py-12">
            <div className="bg-white border-2 border-stone-900 p-10">
              <div className="flex items-start gap-6">
                <Loader2 className="w-8 h-8 text-stone-900 animate-spin flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-stone-900 mb-1">
                    Analyzing Your Contract
                  </h2>
                  <p className="text-sm text-stone-500 mb-6">
                    {statusMessage || 'Preparing analysis...'}
                  </p>

                  {/* Live AI output — terminal style */}
                  {streamingText ? (
                    <div
                      ref={terminalRef}
                      className="bg-stone-950 rounded-lg p-4 font-mono text-xs text-green-400 max-h-60 overflow-y-auto"
                    >
                      <pre className="whitespace-pre-wrap break-all leading-relaxed">
                        {streamingText}
                        <span className="inline-block w-[7px] h-[1em] bg-green-400 ml-0.5 align-middle animate-pulse" />
                      </pre>
                    </div>
                  ) : (
                    /* Skeleton steps before streaming starts */
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-stone-900 rounded-full animate-pulse" />
                        <span className="text-sm text-stone-700">Parsing document structure...</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                        <span className="text-sm text-stone-600">Identifying key clauses...</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-stone-300 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                        <span className="text-sm text-stone-500">Evaluating risk factors...</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-stone-200 rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
                        <span className="text-sm text-stone-400">Generating recommendations...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Signal */}
              <div className="border-t border-stone-200 pt-6 mt-8">
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <div className="w-4 h-4 bg-stone-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span>Your contract is not stored. Analysis is private and secure.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 border-stone-900 p-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-3">Analysis Error</h2>
              <p className="text-stone-700 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 transition-colors"
              >
                Restart Analysis
              </button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && <AnalysisResult analysis={analysis} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-stone-900 mt-32">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="pt-8 flex items-center justify-between">
            <p className="text-xs text-stone-500 mono">© 2025 BeforeYouSign. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs text-stone-500">
              <span className="hover:text-stone-900 transition-colors cursor-pointer underline-effect">Privacy Policy</span>
              <span className="hover:text-stone-900 transition-colors cursor-pointer underline-effect">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
