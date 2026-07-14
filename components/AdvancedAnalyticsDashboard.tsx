'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Users,
  FileText,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  Target,
  Zap,
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalContracts: number;
    activeContracts: number;
    totalValue: number;
    avgRiskScore: number;
    contractsThisMonth: number;
    trend: string;
  };
  risks: {
    high: number;
    medium: number;
    low: number;
    trend: 'up' | 'down' | 'stable';
  };
  savings: {
    identified: number;
    realized: number;
    potential: number;
  };
  timeline: Array<{
    month: string;
    contracts: number;
    value: number;
    avgRisk: number;
  }>;
  categories: Record<string, number>;
  upcomingRenewals: Array<{
    id: string;
    title: string;
    renewalDate: string;
    value: number;
    autoRenew: boolean;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
}

export default function AdvancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics data
    fetchAnalytics();
  }, [timeRange, selectedCategory]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    // Simulated data - replace with actual API call
    const mockData: AnalyticsData = {
      overview: {
        totalContracts: 247,
        activeContracts: 189,
        totalValue: 4750000,
        avgRiskScore: 42,
        contractsThisMonth: 23,
        trend: '+12%',
      },
      risks: {
        high: 12,
        medium: 45,
        low: 132,
        trend: 'down',
      },
      savings: {
        identified: 325000,
        realized: 187000,
        potential: 138000,
      },
      timeline: [
        { month: 'Jan', contracts: 18, value: 420000, avgRisk: 45 },
        { month: 'Feb', contracts: 22, value: 510000, avgRisk: 41 },
        { month: 'Mar', contracts: 19, value: 380000, avgRisk: 39 },
        { month: 'Apr', contracts: 25, value: 625000, avgRisk: 38 },
        { month: 'May', contracts: 23, value: 547000, avgRisk: 42 },
        { month: 'Jun', contracts: 21, value: 489000, avgRisk: 40 },
      ],
      categories: {
        'SaaS Agreements': 89,
        'Employment Contracts': 56,
        'Service Agreements': 43,
        'NDAs': 38,
        'Lease Agreements': 21,
      },
      upcomingRenewals: [
        {
          id: '1',
          title: 'Enterprise SaaS Agreement - Acme Corp',
          renewalDate: '2026-02-15',
          value: 125000,
          autoRenew: false,
        },
        {
          id: '2',
          title: 'Office Lease - Downtown Plaza',
          renewalDate: '2026-03-01',
          value: 84000,
          autoRenew: true,
        },
        {
          id: '3',
          title: 'Cloud Services - AWS',
          renewalDate: '2026-03-15',
          value: 45000,
          autoRenew: true,
        },
      ],
      recentActivity: [
        {
          id: '1',
          type: 'analysis',
          description: 'New contract analyzed: Vendor Agreement',
          timestamp: '2 hours ago',
          user: 'Sarah Chen',
        },
        {
          id: '2',
          type: 'negotiation',
          description: 'Negotiation completed on SaaS Agreement',
          timestamp: '5 hours ago',
          user: 'Michael Torres',
        },
        {
          id: '3',
          type: 'signature',
          description: 'Contract signed: Employment Agreement',
          timestamp: '1 day ago',
          user: 'Jessica Park',
        },
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Contract Analytics</h1>
            <p className="text-stone-600">Comprehensive insights into your contract portfolio</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2 bg-white border-2 border-stone-200 rounded-lg p-1">
              {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    timeRange === range
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-stone-200 rounded-lg hover:border-stone-900 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export Report</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Contracts"
            value={data.overview.totalContracts}
            change={data.overview.trend}
            icon={<FileText className="w-6 h-6" />}
            trend="up"
          />
          <KPICard
            title="Active Contracts"
            value={data.overview.activeContracts}
            subtitle="Currently in force"
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="green"
          />
          <KPICard
            title="Portfolio Value"
            value={`$${(data.overview.totalValue / 1000000).toFixed(1)}M`}
            change="+8.3%"
            icon={<DollarSign className="w-6 h-6" />}
            trend="up"
            color="blue"
          />
          <KPICard
            title="Avg Risk Score"
            value={data.overview.avgRiskScore}
            subtitle="Out of 100"
            icon={<Target className="w-6 h-6" />}
            color={data.overview.avgRiskScore > 60 ? 'red' : data.overview.avgRiskScore > 40 ? 'yellow' : 'green'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Distribution */}
          <div className="lg:col-span-2 bg-white border-2 border-stone-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">Risk Distribution</h3>
                <p className="text-sm text-stone-600">Contract risk levels over time</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {data.risks.trend === 'down' && (
                  <>
                    <TrendingDown className="w-4 h-4 text-stone-600" />
                    <span className="text-stone-600 font-medium">Risk decreasing</span>
                  </>
                )}
              </div>
            </div>

            {/* Risk bars */}
            <div className="space-y-4">
              <RiskBar label="High Risk" count={data.risks.high} total={data.overview.totalContracts} color="red" />
              <RiskBar label="Medium Risk" count={data.risks.medium} total={data.overview.totalContracts} color="yellow" />
              <RiskBar label="Low Risk" count={data.risks.low} total={data.overview.totalContracts} color="green" />
            </div>
          </div>

          {/* Savings Tracker */}
          <div className="bg-stone-50 border-2 border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-stone-900 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">Cost Savings</h3>
                <p className="text-sm text-stone-600">Identified opportunities</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-stone-700">Total Identified</span>
                  <span className="text-2xl font-bold text-stone-900">
                    ${(data.savings.identified / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="h-2 bg-stone-200 overflow-hidden">
                  <div className="h-full bg-stone-900" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-stone-700">Realized</span>
                  <span className="text-lg font-bold text-stone-700">
                    ${(data.savings.realized / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="h-2 bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-stone-700"
                    style={{ width: `${(data.savings.realized / data.savings.identified) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-700">Potential</span>
                  <span className="text-lg font-bold text-stone-500">
                    ${(data.savings.potential / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Contracts by Category</h3>
            <div className="space-y-3">
              {Object.entries(data.categories).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-stone-700">{category}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-stone-900 rounded-full"
                        style={{ width: `${(count / data.overview.totalContracts) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-stone-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Renewals */}
          <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-900">Upcoming Renewals</h3>
              <span className="px-3 py-1 bg-stone-100 text-stone-900 text-xs font-bold">
                {data.upcomingRenewals.length} pending
              </span>
            </div>

            <div className="space-y-3">
              {data.upcomingRenewals.map((renewal) => (
                <div
                  key={renewal.id}
                  className="p-4 border-2 border-stone-200 hover:border-stone-900 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900 text-sm mb-1">{renewal.title}</h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-stone-500" />
                        <span className="text-xs text-stone-600">{renewal.renewalDate}</span>
                      </div>
                    </div>
                    {renewal.autoRenew && (
                      <span className="px-2 py-1 bg-stone-100 text-stone-700 text-xs font-medium">
                        Auto
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-stone-900">
                      ${(renewal.value / 1000).toFixed(0)}K/yr
                    </span>
                    <button className="text-xs text-stone-600 hover:text-stone-900 font-medium">
                      Review →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-stone-900 mb-6">Recent Activity</h3>
          <div className="space-y-3">
            {data.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 hover:bg-stone-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-stone-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-900 mb-1">{activity.description}</p>
                  <div className="flex items-center gap-3 text-xs text-stone-600">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.timestamp}</span>
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

function KPICard({
  title,
  value,
  change,
  subtitle,
  icon,
  trend,
  color = 'stone',
}: {
  title: string;
  value: string | number;
  change?: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  color?: 'stone' | 'green' | 'blue' | 'red' | 'yellow';
}) {
  const colorClasses = {
    stone: 'bg-stone-100 text-stone-900',
    green: 'bg-stone-100 text-stone-900',
    blue: 'bg-stone-100 text-stone-900',
    red: 'bg-stone-100 text-stone-900',
    yellow: 'bg-stone-100 text-stone-900',
  };

  return (
    <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && (
          <div className="flex items-center gap-1 text-stone-700">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-bold">{change}</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-stone-600 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-stone-900">{value}</span>
        {subtitle && <span className="text-sm text-stone-500">{subtitle}</span>}
      </div>
    </div>
  );
}

function RiskBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: 'red' | 'yellow' | 'green';
}) {
  const percentage = (count / total) * 100;
  
  const colorClasses = {
    red: 'bg-stone-900',
    yellow: 'bg-stone-600',
    green: 'bg-stone-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-stone-700">{label}</span>
        <span className="text-sm font-bold text-stone-900">
          {count} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="h-3 bg-stone-100 overflow-hidden">
        <div className={`h-full ${colorClasses[color]}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
