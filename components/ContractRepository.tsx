'use client';

import { FolderOpen, Search, Filter, Plus, Eye, Download, Edit, Trash2, Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, MoreVertical, ArrowUpDown, FileText, Star } from 'lucide-react';
import { useState } from 'react';

export default function ContractRepository() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  const contracts = [
    { id: 1, name: 'Adobe SaaS Agreement', type: 'SaaS', status: 'Active', value: '$59.99/mo', valueNum: 720, risk: 'Low', date: '2024-01-15', renewal: '2025-01-15', tags: ['Recurring', 'Software'], party: 'Adobe Inc.' },
    { id: 2, name: 'Tech Corp Employment Contract', type: 'Employment', status: 'Active', value: '$120K/yr', valueNum: 120000, risk: 'Medium', date: '2023-06-01', renewal: '2025-06-01', tags: ['Annual', 'Full-time'], party: 'Tech Corp' },
    { id: 3, name: 'StartupXYZ Freelance Agreement', type: 'Freelance', status: 'Active', value: '$5K', valueNum: 5000, risk: 'High', date: '2024-11-20', renewal: '2025-11-20', tags: ['Project-based'], party: 'StartupXYZ' },
    { id: 4, name: 'Office Lease Agreement', type: 'Lease', status: 'Active', value: '$3K/mo', valueNum: 36000, risk: 'Medium', date: '2023-09-01', renewal: '2025-09-01', tags: ['Commercial', 'Recurring'], party: 'Property LLC' },
    { id: 5, name: 'NDA - Tech Partner', type: 'NDA', status: 'Pending', value: '-', valueNum: 0, risk: 'Low', date: '2024-12-10', renewal: '2026-12-10', tags: ['Confidential'], party: 'Tech Partner Inc.' },
    { id: 6, name: 'Service Contract - Expired', type: 'Service', status: 'Expired', value: '$1.2K', valueNum: 1200, risk: 'Low', date: '2023-05-15', renewal: '2024-05-15', tags: ['One-time'], party: 'Service Provider' },
  ];

  const riskColors = {
    Low:    { bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-300', dot: 'bg-stone-400' },
    Medium: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-500', dot: 'bg-stone-600' },
    High:   { bg: 'bg-stone-900', text: 'text-white',     border: 'border-stone-900', dot: 'bg-stone-900' },
  };

  const statusColors = {
    Active:  { bg: 'bg-stone-900', text: 'text-white',     icon: CheckCircle },
    Pending: { bg: 'bg-stone-100', text: 'text-stone-700', icon: Clock },
    Expired: { bg: 'bg-stone-100', text: 'text-stone-500', icon: AlertTriangle },
  };

  const filteredContracts = contracts
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.party.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchesRisk = filterRisk === 'all' || c.risk === filterRisk;
      return matchesSearch && matchesStatus && matchesRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'value') return b.valueNum - a.valueNum;
      if (sortBy === 'risk') {
        const riskOrder = { High: 3, Medium: 2, Low: 1 };
        return riskOrder[b.risk as keyof typeof riskOrder] - riskOrder[a.risk as keyof typeof riskOrder];
      }
      return 0;
    });

  const activeContracts = contracts.filter(c => c.status === 'Active').length;
  const highRiskContracts = contracts.filter(c => c.risk === 'High').length;
  const totalValue = contracts.reduce((sum, c) => sum + c.valueNum, 0);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-stone-900">My Contracts</h1>
            <button className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-all">
              <Plus className="w-5 h-5" />
              Add Contract
            </button>
          </div>
          <p className="text-stone-600">Manage and track all your contracts in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-stone-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-stone-900" />
              </div>
              <span className="text-xs font-semibold text-stone-500 uppercase">Total</span>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">{contracts.length}</p>
            <p className="text-sm text-stone-600">Total Contracts</p>
          </div>

          <div className="bg-white border border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-stone-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-stone-900" />
              </div>
              <span className="text-xs font-semibold text-stone-500 uppercase">Active</span>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">{activeContracts}</p>
            <p className="text-sm text-stone-600">Active Contracts</p>
          </div>

          <div className="bg-white border border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-stone-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-stone-900" />
              </div>
              <span className="text-xs font-semibold text-stone-900 uppercase">High Risk</span>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">{highRiskContracts}</p>
            <p className="text-sm text-stone-600">Needs Attention</p>
          </div>

          <div className="bg-white border border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-stone-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-stone-900" />
              </div>
              <span className="text-xs font-semibold text-stone-500 uppercase">Value</span>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">${(totalValue / 1000).toFixed(0)}K</p>
            <p className="text-sm text-stone-600">Total Portfolio Value</p>
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
                  placeholder="Search contracts, parties, types..."
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 border-2 font-semibold transition-all ${showFilters ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 hover:bg-stone-50'
                }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filterStatus !== 'all' || filterRisk !== 'all') && (
                <span className="w-2 h-2 bg-stone-900" />
              )}
            </button>
            <button className="flex items-center gap-2 px-5 py-3 border border-stone-300 font-semibold hover:bg-stone-50 transition-colors">
              <ArrowUpDown className="w-4 h-4" />
              Sort: {sortBy === 'date' ? 'Date' : sortBy === 'value' ? 'Value' : 'Risk'}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="pt-4 border-t border-stone-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    aria-label="Filter contracts by status"
                    className="w-full px-4 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Risk Level</label>
                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value)}
                    aria-label="Filter contracts by risk level"
                    className="w-full px-4 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)} aria-label="Sort contracts by" className="w-full px-4 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="date">Date Added</option>
                    <option value="value">Contract Value</option>
                    <option value="risk">Risk Level</option>
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-stone-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredContracts.map((contract) => {
                  const StatusIcon = statusColors[contract.status as keyof typeof statusColors].icon;
                  const riskColor = riskColors[contract.risk as keyof typeof riskColors];

                  return (
                    <tr key={contract.id} className="hover:bg-stone-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                            <FolderOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 mb-1">{contract.name}</p>
                            <p className="text-xs text-stone-500">with {contract.party}</p>
                            <div className="flex gap-1 mt-1">
                              {contract.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-stone-700">{contract.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColors[contract.status as keyof typeof statusColors].bg} ${statusColors[contract.status as keyof typeof statusColors].text}`}>
                            {contract.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-stone-900">{contract.value}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${riskColor.dot}`} />
                          <span className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${riskColor.bg} ${riskColor.text} ${riskColor.border}`}>
                            {contract.risk}
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
                          <button aria-label="View contract" className="p-2 hover:bg-blue-100 rounded-lg transition-colors group/btn">
                            <Eye className="w-4 h-4 text-stone-600 group-hover/btn:text-blue-600" />
                          </button>
                          <button aria-label="Edit contract" className="p-2 hover:bg-amber-100 rounded-lg transition-colors group/btn">
                            <Edit className="w-4 h-4 text-stone-600 group-hover/btn:text-amber-600" />
                          </button>
                          <button aria-label="Download contract" className="p-2 hover:bg-green-100 rounded-lg transition-colors group/btn">
                            <Download className="w-4 h-4 text-stone-600 group-hover/btn:text-green-600" />
                          </button>
                          <button aria-label="More options" className="p-2 hover:bg-stone-200 rounded-lg transition-colors group/btn">
                            <MoreVertical className="w-4 h-4 text-stone-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 font-semibold">No contracts found</p>
              <p className="text-sm text-stone-400 mt-1">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredContracts.length > 0 && (
          <div className="mt-4 text-sm text-stone-600 text-center">
            Showing <span className="font-bold text-stone-900">{filteredContracts.length}</span> of <span className="font-bold text-stone-900">{contracts.length}</span> contracts
          </div>
        )}
      </div>
    </div>
  );
}
