'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Calendar,
  Zap,
  Globe,
  Building,
  Award,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

export default function MarketIntelligenceDashboard() {
  const [selectedIndustry, setSelectedIndustry] = useState('SaaS');
  const [timeRange, setTimeRange] = useState('6months');

  // Market trends data
  const marketTrends = [
    {
      metric: 'Average Contract Value',
      current: '$125,000',
      change: '+12%',
      trend: 'up',
      description: 'Enterprise SaaS contracts trending higher',
      period: 'vs Last Quarter'
    },
    {
      metric: 'Contract Duration',
      current: '24 months',
      change: '+8%',
      trend: 'up',
      description: 'Longer commitments becoming standard',
      period: 'vs Last Year'
    },
    {
      metric: 'Auto-Renewal Rate',
      current: '78%',
      change: '-5%',
      trend: 'down',
      description: 'More buyers opting for manual renewal',
      period: 'vs Last Quarter'
    },
    {
      metric: 'Payment Terms',
      current: '35 days',
      change: '+3 days',
      trend: 'up',
      description: 'Net payment terms extending',
      period: 'vs Last Year'
    }
  ];

  // Pricing benchmarks
  const pricingBenchmarks = [
    {
      category: 'Enterprise SaaS (100+ seats)',
      range: '$95k - $150k annually',
      median: '$120k',
      yourPosition: '$135k',
      percentile: 72,
      status: 'above-market'
    },
    {
      category: 'Mid-Market SaaS (25-100 seats)',
      range: '$35k - $75k annually',
      median: '$52k',
      yourPosition: '$48k',
      percentile: 42,
      status: 'below-market'
    },
    {
      category: 'Professional Services',
      range: '$150 - $350/hour',
      median: '$225/hour',
      yourPosition: '$200/hour',
      percentile: 38,
      status: 'below-market'
    }
  ];

  // Emerging clauses
  const emergingClauses = [
    {
      clause: 'Data Privacy & GDPR Compliance',
      adoption: 92,
      change: '+18%',
      recommendation: 'critical',
      description: 'Now standard in most enterprise agreements'
    },
    {
      clause: 'Remote Work Provisions',
      adoption: 67,
      change: '+45%',
      recommendation: 'adopt',
      description: 'Rapidly becoming standard post-pandemic'
    },
    {
      clause: 'ESG Commitments',
      adoption: 34,
      change: '+28%',
      recommendation: 'monitor',
      description: 'Growing in enterprise deals'
    },
    {
      clause: 'AI/ML Usage Terms',
      adoption: 28,
      change: '+52%',
      recommendation: 'monitor',
      description: 'Emerging in tech contracts'
    }
  ];

  // Competitive landscape
  const competitors = [
    {
      name: 'Market Leader A',
      marketShare: 35,
      avgPrice: '$145k',
      customerSat: 4.2,
      strengths: ['Brand recognition', 'Feature-rich', 'Integration ecosystem'],
      weaknesses: ['High price', 'Complex onboarding']
    },
    {
      name: 'Fast Growing B',
      marketShare: 22,
      avgPrice: '$98k',
      customerSat: 4.5,
      strengths: ['Modern UX', 'Competitive pricing', 'Fast support'],
      weaknesses: ['Limited features', 'Newer player']
    },
    {
      name: 'Enterprise Giant C',
      marketShare: 18,
      avgPrice: '$180k',
      customerSat: 3.8,
      strengths: ['Enterprise features', 'Security certifications', 'Scale'],
      weaknesses: ['Expensive', 'Slow innovation', 'Poor UX']
    }
  ];

  // Your position
  const yourPosition = {
    marketShare: 8,
    avgPrice: '$115k',
    customerSat: 4.6,
    growth: '+125%',
    positioning: 'Value Leader'
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-stone-600';
  };

  return (
    <div className="min-h-screen bg-stone-50 light-section-pattern">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-12 dark-section-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-stone-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Market Intelligence</h1>
              <p className="text-stone-300 text-sm uppercase tracking-wider mono mt-1">Competitive Analysis & Pricing Benchmarks</p>
            </div>
          </div>
          <p className="text-xl text-stone-300 max-w-3xl">
            Real-time market trends, competitor analysis, and pricing intelligence to help you stay competitive
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="bg-white border-2 border-stone-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 border-2 border-stone-200 rounded-lg font-semibold focus:outline-none focus:border-stone-900"
              >
                <option value="SaaS">SaaS & Technology</option>
                <option value="Professional Services">Professional Services</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Real Estate">Real Estate</option>
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border-2 border-stone-200 rounded-lg font-semibold focus:outline-none focus:border-stone-900"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Zap className="w-4 h-4" />
              <span>Updated 2 hours ago</span>
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Market Trends</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketTrends.map((trend, idx) => (
              <div key={idx} className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">{trend.metric}</p>
                  <div className={`flex items-center gap-1 ${getTrendColor(trend.trend)}`}>
                    {getTrendIcon(trend.trend)}
                    <span className="text-xs font-bold">{trend.change}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-stone-900 mb-2">{trend.current}</p>
                <p className="text-xs text-stone-600 mb-1">{trend.description}</p>
                <p className="text-xs text-stone-500 mono">{trend.period}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Benchmarks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Pricing Benchmarks</h2>
          <div className="bg-white border-2 border-stone-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 border-b-2 border-stone-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Market Range</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Median</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Your Position</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Percentile</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingBenchmarks.map((benchmark, idx) => (
                    <tr key={idx} className="border-b border-stone-200 hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-stone-900">{benchmark.category}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-stone-700 font-mono">{benchmark.range}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-stone-900">{benchmark.median}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-blue-600">{benchmark.yourPosition}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-stone-200 rounded-full h-2 w-20">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${benchmark.percentile}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-stone-700">{benchmark.percentile}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded border font-semibold ${
                          benchmark.status === 'above-market' 
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : 'bg-green-100 text-green-700 border-green-300'
                        }`}>
                          {benchmark.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Emerging Clauses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Emerging Contract Terms</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {emergingClauses.map((clause, idx) => (
              <div key={idx} className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-stone-900 mb-1">{clause.clause}</p>
                    <p className="text-sm text-stone-600">{clause.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border font-semibold flex-shrink-0 ${
                    clause.recommendation === 'critical' ? 'bg-red-100 text-red-700 border-red-300' :
                    clause.recommendation === 'adopt' ? 'bg-green-100 text-green-700 border-green-300' :
                    'bg-yellow-100 text-yellow-700 border-yellow-300'
                  }`}>
                    {clause.recommendation.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-stone-200 rounded-full h-2 w-32">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${clause.adoption}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-stone-700">{clause.adoption}% adoption</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-bold">{clause.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Landscape */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Competitive Landscape</h2>
          
          {/* Your Position */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-2 border-blue-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Your Position</p>
                  <p className="text-2xl font-bold">{yourPosition.positioning}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <TrendingUp className="w-5 h-5" />
                <span className="text-lg font-bold">{yourPosition.growth} YoY</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-blue-100 text-xs mb-1">Market Share</p>
                <p className="text-2xl font-bold">{yourPosition.marketShare}%</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Avg Price</p>
                <p className="text-2xl font-bold">{yourPosition.avgPrice}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Customer Sat</p>
                <p className="text-2xl font-bold">{yourPosition.customerSat}/5.0</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Growth Rate</p>
                <p className="text-2xl font-bold">{yourPosition.growth}</p>
              </div>
            </div>
          </div>

          {/* Competitors */}
          <div className="grid lg:grid-cols-3 gap-4">
            {competitors.map((competitor, idx) => (
              <div key={idx} className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-stone-600" />
                    <p className="font-bold text-stone-900">{competitor.name}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-stone-100 rounded border border-stone-300 font-semibold">
                    {competitor.marketShare}% share
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Avg Price</p>
                    <p className="text-lg font-bold text-stone-900">{competitor.avgPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Satisfaction</p>
                    <p className="text-lg font-bold text-stone-900">{competitor.customerSat}/5.0</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2">Strengths</p>
                    <div className="space-y-1">
                      {competitor.strengths.map((strength, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-green-700">
                          <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2">Weaknesses</p>
                    <div className="space-y-1">
                      {competitor.weaknesses.map((weakness, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-red-700">
                          <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          {weakness}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
