'use client';

import { useState } from 'react';
import { Globe, ArrowRight, CheckCircle, Languages } from 'lucide-react';
import { multiLanguageAnalyzer } from '@/lib/multi-language-analyzer';

export default function MultiLanguagePage() {
  const [contractText, setContractText] = useState('');
  const [detection, setDetection] = useState<any>(null);
  const [translation, setTranslation] = useState<any>(null);

  const handleDetect = async () => {
    if (!contractText.trim()) return;
    
    const result = multiLanguageAnalyzer.detectLanguage(contractText);
    const analysis = await multiLanguageAnalyzer.analyzeInOriginalLanguage(contractText);
    
    setDetection({ ...result, ...analysis });
  };

  const handleTranslate = async () => {
    if (!contractText.trim()) return;
    
    const result = await multiLanguageAnalyzer.translateContract(contractText, 'English');
    setTranslation(result);
  };

  const languages = multiLanguageAnalyzer.getLegalLanguages();

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <div className="mb-4">
            <span className="mono text-xs text-stone-500 tracking-wider uppercase">Multi-Language Analysis</span>
          </div>
          <h1 className="text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Analyze in 50+ Languages
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            AI detects language and analyzes contracts in their original language. Full legal analysis in Spanish, French, German, Chinese, and more.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-stone-900 p-6">
              <label className="block mb-3">
                <span className="mono text-xs text-stone-500 tracking-wider uppercase">Contract (Any Language)</span>
              </label>
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste your contract in any language..."
                className="w-full h-96 px-4 py-3 border-2 border-stone-300 focus:border-stone-900 focus:outline-none font-mono text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDetect}
                disabled={!contractText.trim()}
                className="flex-1 px-6 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Detect Language
              </button>
              <button
                onClick={handleTranslate}
                disabled={!contractText.trim()}
                className="flex-1 px-6 py-3 border-2 border-stone-900 text-stone-900 font-medium hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
              >
                <Languages className="w-4 h-4" />
                Translate
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Language Detection */}
            {detection && (
              <div className="bg-white border-2 border-stone-900 p-6">
                <h3 className="font-bold text-stone-900 text-xl mb-4">Language Detection</h3>
                
                <div className="space-y-4">
                  <div className="bg-stone-50 p-4 border border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-stone-500 mono">DETECTED LANGUAGE</p>
                      <span className="text-2xl">{detection.language === 'English' ? '🇺🇸' : detection.language === 'Spanish' ? '🇪🇸' : detection.language === 'French' ? '🇫🇷' : detection.language === 'German' ? '🇩🇪' : '🌍'}</span>
                    </div>
                    <p className="text-2xl font-bold text-stone-900">{detection.language}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-stone-500 mono mb-1">CONFIDENCE</p>
                      <p className="text-xl font-bold text-stone-900">{Math.round(detection.confidence * 100)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 mono mb-1">LEGAL SUPPORT</p>
                      <div className="flex items-center gap-2">
                        {detection.canAnalyze ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Full Support</span>
                          </>
                        ) : (
                          <span className="text-sm text-amber-600">Translation Required</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 border-2 ${
                    detection.canAnalyze ? 'border-green-600 bg-green-50' : 'border-amber-600 bg-amber-50'
                  }`}>
                    <p className="text-sm text-stone-900">
                      {detection.canAnalyze 
                        ? `✓ This contract can be analyzed directly in ${detection.language}`
                        : `⚠ Translation to English recommended for full analysis`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Translation */}
            {translation && (
              <div className="bg-white border-2 border-stone-900 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-stone-900 text-xl">Translation</h3>
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold mono">
                    {translation.quality.toUpperCase()}
                  </span>
                </div>

                <div className="bg-stone-50 p-4 border border-stone-200 mb-4">
                  <p className="text-xs text-stone-500 mono mb-2">
                    {translation.originalLanguage} → {translation.targetLanguage}
                  </p>
                  <p className="text-sm text-stone-700 leading-relaxed max-h-64 overflow-y-auto">
                    {translation.translatedText}
                  </p>
                </div>

                <button className="w-full px-6 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all flex items-center justify-center gap-2">
                  <span>Analyze Translated Contract</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Supported Languages */}
            {!detection && !translation && (
              <div className="bg-white border-2 border-stone-300 p-6">
                <h3 className="font-bold text-stone-900 mb-4 mono text-xs tracking-wider">SUPPORTED LANGUAGES</h3>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map(lang => (
                    <div key={lang.code} className="flex items-center gap-2 p-2 bg-stone-50 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-stone-700">{lang.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
