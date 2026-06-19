'use client';

import { useState } from 'react';
import { TrendingUp, ArrowRight, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { marketBenchmarkEngine } from '@/lib/market-benchmark-engine';

export default function BenchmarkPage() {
  const [contractText, setContractText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!contractText.trim()) return;
    
    setAnalyzing(true);
    
    setTimeout(async () => {
      const result = await marketBenchmarkEngine.analyzeContract(contractText, 'technology');
      setAnalysis(result);
      setAnalyzing(false);
    }, 1500);
  };

  const getRatingColor = (rating: string) => {
    if (rating === 'very favorable' || rating === 'favorable') return 'text-green-600';
    if (rating === 'market standard') return 'text-stone-600';
    return 'text-red-600';
  };

  const getRatingBg = (rating: string) => {
    if (rating === 'very favorable' || rating === 'favorable') return 'border-green-600 bg-green-50';
    if (rating === 'market standard') return 'border-stone-600 bg-stone-50';
    return 'border-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4">
            <span className="mono text-xs text-stone-500 tracking-wider uppercase">Market Intelligence</span>
          </div>
          <h1 className="text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Benchmark Your Contract
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            Compare your contract terms against thousands of real-world agreements. 
            Know exactly where you stand vs. market standards and competitors.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-stone-900 p-6">
              <label className="block mb-3">
                <span className="mono text-xs text-stone-500 tracking-wider uppercase">Contract Text</span>
              </label>
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste your contract here for market benchmarking..."
                className="w-full h-96 px-4 py-3 border-2 border-stone-300 focus:border-stone-900 focus:outline-none font-mono text-sm"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !contractText.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-stone-900 text-white font-medium hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all duration-300 group"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Get Market Analysis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!analysis ? (
              <div className="bg-white border-2 border-stone-300 p-12 text-center">
                <BarChart3 className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600 font-light">
                  Paste your contract and click analyze to see market benchmarks
                </p>
              </div>
            ) : (
              <>
                {/* Competitiveness Score */}
                <div className="bg-white border-2 border-stone-900 p-6">
                  <h3 className="font-bold text-stone-900 text-xl mb-4">Overall Competitiveness</h3>
                  <div className="text-center py-8">
                    <div className="text-6xl font-bold text-stone-900 mb-2">
                      {analysis.overallCompetitiveness}
                    </div>
                    <div className="text-sm text-stone-600 mono">/ 100 PERCENTILE</div>
                    <p className="mt-4 text-sm text-stone-700">
                      {analysis.overallCompetitiveness > 70
                        ? 'Your terms are more favorable than most market contracts'
                        : analysis.overallCompetitiveness > 40
                        ? 'Your terms are aligned with market standards'
                        : 'Your terms are below market average - room for improvement'}
                    </p>
                  </div>
                </div>

                {/* Benchmarks */}
                <div className="space-y-4">
                  {analysis.benchmarks.map((benchmark: any, idx: number) => (
                    <div
                      key={idx}
                      className={`bg-white border-2 p-6 ${getRatingBg(benchmark.rating)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-stone-900">{benchmark.term}</h4>
                        <span className={`text-sm font-bold mono ${getRatingColor(benchmark.rating)}`}>
                          {benchmark.yourPercentile}th
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-stone-500 mono text-xs mb-1">YOUR VALUE</p>
                          <p className="font-medium text-stone-900">{benchmark.yourValue}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 mono text-xs mb-1">MARKET MEDIAN</p>
                          <p className="font-medium text-stone-900">{benchmark.marketMedian}</p>
                        </div>
                      </div>

                      <div className="border-l-2 border-stone-900 pl-4">
                        <p className="text-sm text-stone-700 leading-relaxed">
                          {benchmark.recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SWOT Analysis */}
                {(analysis.strengths.length > 0 || analysis.weaknesses.length > 0) && (
                  <div className="bg-white border-2 border-stone-900 p-6">
                    <h3 className="font-bold text-stone-900 text-xl mb-4">Strategic Analysis</h3>

                    {analysis.strengths.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-stone-900">Strengths</span>
                        </div>
                        <ul className="space-y-1 pl-7">
                          {analysis.strengths.map((strength: string, idx: number) => (
                            <li key={idx} className="text-sm text-stone-700">{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.weaknesses.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-stone-900">Weaknesses</span>
                        </div>
                        <ul className="space-y-1 pl-7">
                          {analysis.weaknesses.map((weakness: string, idx: number) => (
                            <li key={idx} className="text-sm text-stone-700">{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.opportunities.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-amber-600" />
                          <span className="font-medium text-stone-900">Opportunities</span>
                        </div>
                        <ul className="space-y-1 pl-7">
                          {analysis.opportunities.map((opp: string, idx: number) => (
                            <li key={idx} className="text-sm text-stone-700">{opp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
