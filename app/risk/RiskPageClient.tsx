'use client';

import { useState } from 'react';
import { Brain, ArrowRight, AlertTriangle, TrendingDown, Shield, Clock } from 'lucide-react';
import { mlRiskPredictor } from '@/lib/ml-risk-predictor';

// Metadata is exported from the parent server page wrapper (app/risk/page.tsx)

export default function RiskPage() {
  const [contractText, setContractText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!contractText.trim()) return;
    
    setAnalyzing(true);
    
    setTimeout(async () => {
      const result = await mlRiskPredictor.predictRisk(contractText, {
        industry: 'technology',
        contractValue: 100000,
        duration: 12,
      });
      setPrediction(result);
      setAnalyzing(false);
    }, 2000);
  };

  const getRiskColor = (risk: number) => {
    if (risk > 70) return 'text-red-600';
    if (risk > 40) return 'text-amber-600';
    return 'text-green-600';
  };

  const getRiskBg = (risk: number) => {
    if (risk > 70) return 'bg-red-600';
    if (risk > 40) return 'bg-amber-600';
    return 'bg-green-600';
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4">
            <span className="mono text-xs text-stone-500 tracking-wider uppercase">ML Risk Prediction</span>
          </div>
          <h1 className="text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Predict Contract Risks
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            Machine learning predicts dispute probability, breach likelihood, and litigation risk with 
            82-95% accuracy. Know the risks before they become problems.
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
                placeholder="Paste your contract here for ML risk analysis..."
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
                  <span>Running ML Analysis...</span>
                </>
              ) : (
                <>
                  <span>Predict Risk</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!prediction ? (
              <div className="bg-white border-2 border-stone-300 p-12 text-center">
                <Brain className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600 font-light">
                  Paste your contract and click analyze to get ML risk prediction
                </p>
              </div>
            ) : (
              <>
                {/* Risk Scores */}
                <div className="bg-white border-2 border-stone-900 p-6">
                  <h3 className="font-bold text-stone-900 text-xl mb-6">Risk Assessment</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-stone-700">Overall Risk</span>
                        <span className={`text-2xl font-bold ${getRiskColor(prediction.overallRisk)}`}>
                          {prediction.overallRisk}%
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 h-2">
                        <div
                          className={`h-2 ${getRiskBg(prediction.overallRisk)}`}
                          style={{ width: `${prediction.overallRisk}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-stone-700">Dispute Probability</span>
                        <span className={`text-xl font-bold ${getRiskColor(prediction.disputeProbability)}`}>
                          {prediction.disputeProbability}%
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 h-2">
                        <div
                          className={`h-2 ${getRiskBg(prediction.disputeProbability)}`}
                          style={{ width: `${prediction.disputeProbability}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-stone-700">Breach Likelihood</span>
                        <span className={`text-xl font-bold ${getRiskColor(prediction.breachLikelihood)}`}>
                          {prediction.breachLikelihood}%
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 h-2">
                        <div
                          className={`h-2 ${getRiskBg(prediction.breachLikelihood)}`}
                          style={{ width: `${prediction.breachLikelihood}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {prediction.timeToDispute && (
                    <div className="mt-4 pt-4 border-t-2 border-stone-200 flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-stone-600" />
                      <span className="text-stone-700">
                        <span className="font-medium">Time to Dispute:</span> {prediction.timeToDispute}
                      </span>
                    </div>
                  )}
                </div>

                {/* Top Risks */}
                {prediction.topRisks && prediction.topRisks.length > 0 && (
                  <div className="bg-white border-2 border-stone-900 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-stone-900" />
                      <h3 className="font-bold text-stone-900 text-xl">Top Risks Identified</h3>
                    </div>
                    <div className="space-y-3">
                      {prediction.topRisks.map((risk: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-amber-600 bg-amber-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-stone-900">{risk.category}</span>
                            <span className={`text-sm font-bold ${getRiskColor(risk.risk)}`}>
                              {risk.risk}% risk
                            </span>
                          </div>
                          <p className="text-sm text-stone-700 leading-relaxed">{risk.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {prediction.recommendations && prediction.recommendations.length > 0 && (
                  <div className="bg-white border-2 border-stone-900 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-6 h-6 text-stone-900" />
                      <h3 className="font-bold text-stone-900 text-xl">AI Recommendations</h3>
                    </div>
                    <ul className="space-y-2">
                      {prediction.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <TrendingDown className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-stone-700 leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
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
