'use client';

import { useState } from 'react';
import { BookOpen, Search, Filter, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { clauseLibraryEngine } from '@/lib/clause-library-engine';

export default function ClausesPage() {
  const [category, setCategory] = useState('');
  const [clauses, setClauses] = useState(clauseLibraryEngine.getMostUsed());
  const [selectedClause, setSelectedClause] = useState<any>(null);

  const handleSearch = () => {
    const results = clauseLibraryEngine.searchClauses(category || undefined);
    setClauses(results);
  };

  const categories = clauseLibraryEngine.getCategories();

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-green-600 bg-green-50 border-green-600';
    if (risk === 'medium') return 'text-amber-600 bg-amber-50 border-amber-600';
    return 'text-red-600 bg-red-50 border-red-600';
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <div className="mb-4">
            <span className="mono text-xs text-stone-500 tracking-wider uppercase">AI Clause Library</span>
          </div>
          <h1 className="text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Pre-Vetted Legal Clauses
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            5,000+ professionally drafted clauses with risk ratings. Find safer alternatives and compare options.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white border-2 border-stone-900 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block mb-2">
                <span className="mono text-xs text-stone-500 tracking-wider uppercase">Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-300 focus:border-stone-900 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full px-6 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Clause List */}
          <div className="lg:col-span-2 space-y-4">
            {clauses.map(clause => (
              <div
                key={clause.id}
                onClick={() => setSelectedClause(clause)}
                className={`bg-white border-2 p-6 cursor-pointer transition-all ${
                  selectedClause?.id === clause.id
                    ? 'border-stone-900'
                    : 'border-stone-300 hover:border-stone-500'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-stone-900 mb-1">{clause.title}</h3>
                    <p className="text-xs text-stone-500 mono">{clause.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 border text-xs font-bold mono ${getRiskColor(clause.riskLevel)}`}>
                      {clause.riskLevel.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1 text-stone-500">
                      <Star className="w-4 h-4" />
                      <span className="text-xs">{clause.usageCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed line-clamp-2">
                  {clause.text}
                </p>
              </div>
            ))}
          </div>

          {/* Clause Detail */}
          <div className="space-y-6">
            {!selectedClause ? (
              <div className="bg-white border-2 border-stone-300 p-8 text-center">
                <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600 font-light">
                  Select a clause to see details
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white border-2 border-stone-900 p-6">
                  <h3 className="font-bold text-stone-900 text-xl mb-4">{selectedClause.title}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-stone-500 mono mb-2">FULL TEXT</p>
                      <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 border border-stone-200">
                        {selectedClause.text}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-stone-500 mono mb-1">RISK LEVEL</p>
                        <span className={`px-3 py-1 border text-xs font-bold mono ${getRiskColor(selectedClause.riskLevel)}`}>
                          {selectedClause.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 mono mb-1">FAVORABLE TO</p>
                        <p className="text-sm font-medium text-stone-900 capitalize">{selectedClause.favorableTo}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-stone-500 mono mb-1">USAGE</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-stone-700">{selectedClause.usageCount.toLocaleString()} contracts</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedClause.alternatives.length > 0 && (
                  <div className="bg-white border-2 border-stone-900 p-6">
                    <h4 className="font-bold text-stone-900 mb-4">Alternative Versions</h4>
                    <div className="space-y-2">
                      {selectedClause.alternatives.map((altId: string) => {
                        const alt = clauseLibraryEngine.getClause(altId);
                        return alt ? (
                          <button
                            key={altId}
                            onClick={() => setSelectedClause(alt)}
                            className="w-full text-left p-3 border-2 border-stone-300 hover:border-stone-900 transition-all flex items-center justify-between group"
                          >
                            <span className="text-sm font-medium text-stone-900">{alt.title}</span>
                            <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
                          </button>
                        ) : null;
                      })}
                    </div>
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
