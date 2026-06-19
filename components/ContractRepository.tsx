'use client';

import { FolderOpen, Search, Filter, Plus, Eye, Download, Edit, Trash2, Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, MoreVertical, ArrowUpDown, FileText, Star, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ContractData {
  id: string;
  name: string;
  type: string;
  status: string;
  risk: string;
  date: string;
  summary: string;
  redFlagsCount: number;
  clausesCount: number;
  riskScore: number;
}

export default function ContractRepository() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      async function fetchContracts() {
        setIsLoading(true);
        try {
          const params = new URLSearchParams({
            search: searchQuery,
            risk: filterRisk,
            sort: sortBy
          });
          const res = await fetch(`/api/contracts?${params.toString()}`);
          const data = await res.json();
          if (data.success) {
            const mapped = data.contracts.map((c: any) => ({
              id: c.id,
              name: c.fileName,
              type: c.contractType || 'Document',
              status: 'Analyzed',
              risk: c.riskScore >= 70 ? 'High' : c.riskScore >= 40 ? 'Medium' : 'Low',
              date: new Date(c.createdAt).toLocaleDateString(),
              summary: c.summary,
              redFlagsCount: c.redFlagsCount,
              clausesCount: c.clausesCount,
              riskScore: c.riskScore,
            }));
            setContracts(mapped);
          }
        } catch (error) {
          console.error('Failed to fetch contracts', error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchContracts();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, filterRisk, sortBy]);

  const riskColors = {
    Low:    { bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-300', dot: 'bg-stone-400' },
    Medium: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-500', dot: 'bg-stone-600' },
    High:   { bg: 'bg-stone-900', text: 'text-white',     border: 'border-stone-900', dot: 'bg-stone-900' },
  };

  const filteredContracts = contracts; // Server-side handles filtering and sorting

  const highRiskContracts = contracts.filter(c => c.risk === 'High').length;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-stone-900">My Contracts</h1>
            <a href="/analyze" className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-all">
              <Plus className="w-5 h-5" />
              New Analysis
            </a>
          </div>
          <p className="text-stone-600">Manage and track all your analyzed contracts in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-stone-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-stone-900" />
              </div>
              <span className="text-xs font-semibold text-stone-500 uppercase">Total</span>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">{isLoading ? '-' : contracts.length}</p>
            <p className="text-sm text-stone-600">Total Analyzed</p>
          </div>

          <div className="bg-white border border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-stone-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-stone-900" />
              </div>
              <span className="text-xs font-semibold text-stone-900 uppercase">High Risk</span>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">{isLoading ? '-' : highRiskContracts}</p>
            <p className="text-sm text-stone-600">Needs Attention</p>
          </div>

          <div className="bg-white border border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-stone-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-stone-900" />
              </div>
              <span className="text-xs font-semibold text-stone-500 uppercase">Status</span>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">Active</p>
            <p className="text-sm text-stone-600">Repository Online</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-stone-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contracts or types..."
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 border-2 font-semibold transition-all ${showFilters ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 hover:bg-stone-50'}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {filterRisk !== 'all' && <span className="w-2 h-2 bg-stone-900" />}
            </button>
            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'risk' : 'date')}
              className="flex items-center gap-2 px-5 py-3 border border-stone-300 font-semibold hover:bg-stone-50 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort: {sortBy === 'date' ? 'Date' : 'Risk Score'}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="pt-4 border-t border-stone-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Risk Level</label>
                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contracts Table */}
        <div className="bg-white border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Contract</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Risk Score</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-stone-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                      Loading contracts...
                    </td>
                  </tr>
                ) : filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                      <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                      <p className="font-semibold text-stone-600">No contracts found</p>
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => {
                    const riskColor = riskColors[contract.risk as keyof typeof riskColors];

                    return (
                      <tr 
                        key={contract.id} 
                        onClick={() => router.push(`/contracts/${contract.id}`)}
                        className="hover:bg-stone-50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                              <FolderOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold text-stone-900 mb-1 max-w-xs truncate" title={contract.name}>{contract.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-stone-700">{contract.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
                              Analyzed
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${riskColor.dot}`} />
                            <span className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${riskColor.bg} ${riskColor.text} ${riskColor.border}`}>
                              {contract.riskScore} / 100
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-stone-600">
                            <Calendar className="w-4 h-4" />
                            {contract.date}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedContract(contract)}
                              aria-label="View analysis"
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors group/btn"
                            >
                              <Eye className="w-4 h-4 text-stone-600 group-hover/btn:text-blue-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count */}
        {filteredContracts.length > 0 && (
          <div className="mt-4 text-sm text-stone-600 text-center">
            Showing <span className="font-bold text-stone-900">{filteredContracts.length}</span> of <span className="font-bold text-stone-900">{contracts.length}</span> contracts
          </div>
        )}
      </div>

      {/* Analysis Details Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-stone-600" />
                {selectedContract.name}
              </h2>
              <button 
                onClick={() => setSelectedContract(null)}
                className="text-stone-500 hover:text-stone-900 font-bold p-2"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-stone-50 p-4 border border-stone-200 rounded-lg">
                  <div className="text-sm text-stone-500 mb-1">Risk Score</div>
                  <div className="text-2xl font-bold text-stone-900">{selectedContract.riskScore}</div>
                </div>
                <div className="bg-stone-50 p-4 border border-stone-200 rounded-lg">
                  <div className="text-sm text-stone-500 mb-1">Red Flags</div>
                  <div className="text-2xl font-bold text-stone-900">{selectedContract.redFlagsCount}</div>
                </div>
                <div className="bg-stone-50 p-4 border border-stone-200 rounded-lg">
                  <div className="text-sm text-stone-500 mb-1">Clauses Detected</div>
                  <div className="text-2xl font-bold text-stone-900">{selectedContract.clausesCount}</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-stone-600" />
                  Executive Summary
                </h3>
                <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 text-stone-700 whitespace-pre-wrap">
                  {selectedContract.summary}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-stone-200 bg-stone-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedContract(null)}
                className="px-6 py-2 border border-stone-300 font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
