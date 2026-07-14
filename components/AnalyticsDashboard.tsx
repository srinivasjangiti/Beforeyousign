'use client';

import { BarChart3, TrendingUp, TrendingDown, DollarSign, FileText, AlertTriangle, Calendar, Shield, CheckCircle, XCircle, Clock, Target, PieChart, Activity } from 'lucide-react';
import { useState } from 'react';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('6months');

  const stats = [
    { label: 'Total Contracts', value: '47', change: '+12%', trend: 'up', icon: FileText, color: 'blue' },
    { label: 'Total Value', value: '$487K', change: '+28%', trend: 'up', icon: DollarSign, color: 'green' },
    { label: 'Avg Risk Score', value: '42', change: '-15%', trend: 'down', icon: AlertTriangle, color: 'amber' },
    { label: 'Savings Identified', value: '$40.5K', change: '+68%', trend: 'up', icon: TrendingUp, color: 'emerald' },
  ];

  const riskDistribution = [
    { level: 'Low Risk', count: 18, percentage: 38, color: 'bg-stone-400' },
    { level: 'Medium Risk', count: 21, percentage: 45, color: 'bg-stone-600' },
    { level: 'High Risk', count: 8, percentage: 17, color: 'bg-stone-900' },
  ];

  const contractsByType = [
    { type: 'Employment', count: 12, value: '$240K', color: 'bg-stone-900' },
    { type: 'SaaS', count: 15, value: '$120K', color: 'bg-stone-700' },
    { type: 'Freelance', count: 8, value: '$45K', color: 'bg-stone-500' },
    { type: 'Lease', count: 6, value: '$54K', color: 'bg-stone-400' },
    { type: 'NDA', count: 6, value: '$28K', color: 'bg-stone-300' },
  ];

  const monthlyData = [
    { month: 'Jul', contracts: 5, savings: 4200, risk: 52 },
    { month: 'Aug', contracts: 8, savings: 6800, risk: 48 },
    { month: 'Sep', contracts: 12, savings: 9200, risk: 45 },
    { month: 'Oct', contracts: 15, savings: 12500, risk: 42 },
    { month: 'Nov', contracts: 18, savings: 15800, risk: 38 },
    { month: 'Dec', contracts: 21, savings: 18200, risk: 35 },
  ];

  const redFlags = [
    { issue: 'Auto-Renewal Clauses', count: 12, severity: 'high' },
    { issue: 'Unlimited Liability', count: 5, severity: 'critical' },
    { issue: 'Non-Compete Terms', count: 8, severity: 'medium' },
    { issue: 'Unfair Termination', count: 6, severity: 'high' },
  ];

  const colorMap = {
    blue:    { bg: 'bg-stone-100', text: 'text-stone-900', icon: 'text-stone-900' },
    green:   { bg: 'bg-stone-100', text: 'text-stone-900', icon: 'text-stone-900' },
    amber:   { bg: 'bg-stone-100', text: 'text-stone-900', icon: 'text-stone-900' },
    emerald: { bg: 'bg-stone-100', text: 'text-stone-900', icon: 'text-stone-900' },
  };

  const maxContracts = Math.max(...monthlyData.map(d => d.contracts));
  const maxSavings = Math.max(...monthlyData.map(d => d.savings));

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">Analytics Dashboard</h1>
              <p className="text-stone-600">Track your contract portfolio performance and insights</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              aria-label="Select time range for analytics"
              className="px-4 py-2 border-2 border-stone-200 bg-white focus:outline-none focus:border-stone-900"
            >
              <option value="1month">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const colors = colorMap[stat.color as keyof typeof colorMap];
            return (
              <div key={index} className="bg-white border-2 border-stone-200 hover:border-stone-900 transition-all p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colors.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 border ${
                    stat.trend === 'up' ? 'border-stone-900 text-stone-900' : 'border-stone-400 text-stone-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-stone-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-stone-600 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Contract Growth Chart */}
          <div className="bg-white border-2 border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-stone-900" />
                <h2 className="text-lg font-bold text-stone-900">Contract Growth</h2>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-stone-900 font-semibold">+68%</span>
                <TrendingUp className="w-4 h-4 text-stone-900" />
              </div>
            </div>
            <div className="space-y-3">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-stone-600 w-8">{data.month}</span>
                  <div className="flex-1 bg-stone-100 h-8 relative overflow-hidden">
                    <div
                      className="bg-stone-900 h-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(data.contracts / maxContracts) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">{data.contracts}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white border-2 border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-stone-900" />
                <h2 className="text-lg font-bold text-stone-900">Risk Distribution</h2>
              </div>
              <span className="text-sm text-stone-600">{riskDistribution.reduce((sum, r) => sum + r.count, 0)} Total</span>
            </div>
            <div className="space-y-4">
              {riskDistribution.map((risk, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-stone-700">{risk.level}</span>
                    <span className="text-sm font-bold text-stone-900">{risk.count} ({risk.percentage}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-3 overflow-hidden">
                    <div
                      className={`${risk.color} h-full transition-all duration-500`}
                      style={{ width: `${risk.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-stone-100 border border-stone-300">
              <p className="text-sm text-stone-800">
                <strong className="font-bold">62% Low-Medium Risk</strong> — Your portfolio is relatively safe
              </p>
            </div>
          </div>
        </div>

        {/* Contracts by Type & Savings Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Contracts by Type */}
          <div className="bg-white border-2 border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-5 h-5 text-stone-900" />
              <h2 className="text-lg font-bold text-stone-900">Contracts by Type</h2>
            </div>
            <div className="space-y-3">
              {contractsByType.map((contract, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${contract.color}`} />
                    <span className="font-semibold text-stone-900">{contract.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-stone-600">{contract.count} contracts</span>
                    <span className="text-sm font-bold text-stone-900">{contract.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Tracker */}
          <div className="bg-white border-2 border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-stone-900" />
                <h2 className="text-lg font-bold text-stone-900">Savings Tracker</h2>
              </div>
              <span className="text-sm font-bold text-stone-900">$40,540 Total</span>
            </div>
            <div className="space-y-3">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-stone-600 w-8">{data.month}</span>
                  <div className="flex-1 bg-stone-100 h-7 relative overflow-hidden">
                    <div
                      className="bg-stone-900 h-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(data.savings / maxSavings) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">${(data.savings / 1000).toFixed(1)}K</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Red Flags Overview */}
        <div className="bg-white border-2 border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-stone-900" />
            <h2 className="text-lg font-bold text-stone-900">Common Red Flags Found</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {redFlags.map((flag, idx) => (
              <div key={idx} className="p-4 border-2 border-stone-200 bg-stone-50">
                <div className="inline-flex px-2 py-1 border border-stone-900 text-xs font-bold mb-2 text-stone-900 uppercase tracking-wider">
                  {flag.severity}
                </div>
                <h3 className="font-bold text-stone-900 mb-1">{flag.issue}</h3>
                <p className="text-2xl font-bold text-stone-900">{flag.count}</p>
                <p className="text-xs text-stone-600 mt-1">contracts affected</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
