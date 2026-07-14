'use client';

import { useState } from 'react';
import { Mic, MicOff, FileText, Download, CheckCircle, ArrowRight } from 'lucide-react';
import { voiceContractEngine } from '@/lib/voice-contract-engine';

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [contract, setContract] = useState('');

  const handleVoiceInput = async (text: string) => {
    const result = await voiceContractEngine.processVoiceInput(text);
    
    setTranscript(prev => [...prev, text]);
    setResponses(prev => [...prev, result.response]);
    
    if (result.contractReady) {
      const generated = await voiceContractEngine.generateContract();
      setContract(generated);
    }
  };

  const simulateVoiceInput = () => {
    const samples = [
      "I need a service agreement",
      "Payment will be $5000",
      "The contract should last 6 months"
    ];
    
    let index = 0;
    setIsRecording(true);
    
    const interval = setInterval(() => {
      if (index < samples.length) {
        handleVoiceInput(samples[index]);
        index++;
      } else {
        setIsRecording(false);
        clearInterval(interval);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <div className="mb-4">
            <span className="mono text-xs text-stone-500 tracking-wider uppercase">Voice-to-Contract</span>
          </div>
          <h1 className="text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Create Contracts by Speaking
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            Just talk. AI creates production-ready legal contracts from your voice. No typing, no templates, just speak.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Voice Input */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-stone-900 p-8 text-center">
              <button
                onClick={simulateVoiceInput}
                disabled={isRecording}
                className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-600 animate-pulse'
                    : 'bg-stone-900 hover:bg-stone-800'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-16 h-16 text-white" />
                ) : (
                  <Mic className="w-16 h-16 text-white" />
                )}
              </button>
              <p className="text-sm text-stone-600 mono">
                {isRecording ? 'Listening...' : 'Click to start speaking'}
              </p>
            </div>

            {transcript.length > 0 && (
              <div className="bg-white border-2 border-stone-300 p-6">
                <h3 className="font-bold text-stone-900 mb-4 mono text-xs tracking-wider">CONVERSATION</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transcript.map((text, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="bg-stone-100 p-3 rounded">
                        <p className="text-sm text-stone-900">You: {text}</p>
                      </div>
                      {responses[idx] && (
                        <div className="bg-stone-900 text-white p-3 rounded">
                          <p className="text-sm">AI: {responses[idx]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generated Contract */}
          <div className="space-y-6">
            {contract ? (
              <>
                <div className="bg-white border-2 border-stone-900 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-stone-900" />
                      <h3 className="font-bold text-stone-900 text-xl">Contract Ready</h3>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <pre className="text-sm font-mono text-stone-700 whitespace-pre-wrap max-h-96 overflow-y-auto bg-stone-50 p-4 border border-stone-200">
                    {contract}
                  </pre>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-6 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex-1 px-6 py-3 border-2 border-stone-900 text-stone-900 font-medium hover:bg-stone-50 transition-all">
                    Edit Contract
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white border-2 border-stone-300 p-12 text-center">
                <FileText className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600 font-light">
                  Your contract will appear here as you speak
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
