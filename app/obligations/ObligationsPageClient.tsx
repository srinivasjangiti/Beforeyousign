'use client';

import { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, ArrowRight, Calendar } from 'lucide-react';
import { obligationTracker } from '@/lib/obligation-tracker';

export default function ObligationsPage() {
  const [contractText, setContractText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [obligations, setObligations] = useState<any[]>([]);

  const handleAnalyze = async () => {
    if (!contractText.trim()) return;
    
    setAnalyzing(true);
    
    setTimeout(async () => {
      const results = await obligationTracker.extractObligations(contractText, ['Company A', 'Company B']);
      setObligations(results);
      setAnalyzing(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'border-green-600 bg-green-50';
    if (status === 'overdue') return 'border-red-600 bg-red-50';
    return 'border-amber-600 bg-amber-50';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'critical') return 'bg-red-600 text-white';
    if (priority === 'high') return 'bg-amber-600 text-white';
    if (priority === 'medium') return 'bg-stone-600 text-white';
    return 'bg-stone-400 text-white';
  };

  const stats = obligations.length > 0 ? {
    total: obligations.length,
    pending: obligations.filter(o => o.status === 'pending').length,
    completed: obligations.filter(o => o.status === 'completed').length,
    overdue: obligations.filter(o => o.status === 'overdue').length,
    critical: obligations.filter(o => o.priority === 'critical' || o.priority === 'high').length,
  } : null;

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <div className="mb-4">
            <span className="mono text-xs text-stone-500 tracking-wider uppercase">Obligation Tracker</span>
          </div>
          <h1 className="text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Track All Obligations
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            AI automatically extracts every contractual obligation with deadlines. Never miss a commitment.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-stone-900 p-6">
              <label className="block mb-3">
                <span className="mono text-xs text-stone-500 tracking-wider uppercase">Contract Text</span>
              </label>
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste your contract to extract obligations..."
                className="w-full h-96 px-4 py-3 border-2 border-stone-300 focus:border-stone-900 focus:outline-none font-mono text-sm"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !contractText.trim()}
              className="w-full px-8 py-3.5 bg-stone-900 text-white font-medium hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <span>Extract Obligations</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {obligations.length === 0 ? (
              <div className="bg-white border-2 border-stone-300 p-12 text-center">
                <Clock className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600 font-light">
                  Paste a contract to extract and track obligations
                </p>
              </div>
            ) : (
              <>
                {/* Stats */}
                {stats && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border-2 border-stone-900 p-4">
                      <p className="text-xs text-stone-500 mono mb-1">TOTAL</p>
                      <p className="text-3xl font-bold text-stone-900">{stats.total}</p>
                    </div>
                    <div className="bg-white border-2 border-amber-600 p-4">
                      <p className="text-xs text-stone-500 mono mb-1">PENDING</p>
                      <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white border-2 border-green-600 p-4">
                      <p className="text-xs text-stone-500 mono mb-1">COMPLETED</p>
                      <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="bg-white border-2 border-red-600 p-4">
                      <p className="text-xs text-stone-500 mono mb-1">CRITICAL</p>
                      <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
                    </div>
                  </div>
                )}

                {/* Obligations List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {obligations.map((obl, idx) => (
                    <div
                      key={idx}
                      className={`bg-white border-2 p-4 ${getStatusColor(obl.status)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-bold mono ${getPriorityColor(obl.priority)}`}>
                            {obl.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-stone-600 mono">{obl.id}</span>
                        </div>
                        {obl.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {obl.status === 'overdue' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                      </div>

                      <p className="text-sm text-stone-900 mb-3 leading-relaxed">{obl.description}</p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-stone-600">
                          <span className="font-medium">Party:</span>
                          <span>{obl.party}</span>
                        </div>
                        {obl.deadline && (
                          <div className="flex items-center gap-1 text-stone-600">
                            <Calendar className="w-3 h-3" />
                            <span>{obl.deadline.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-stone-500 mt-2 mono">Source: {obl.source}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
