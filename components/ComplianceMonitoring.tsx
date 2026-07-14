'use client';

import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Globe,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  Lock,
  Database,
  Zap,
  Bell,
  Download,
  RefreshCw
} from 'lucide-react';

export default function ComplianceMonitoring() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all');
  const [selectedCompliance, setSelectedCompliance] = useState('all');

  // Compliance status by jurisdiction
  const jurisdictionCompliance = [
    {
      jurisdiction: 'California (CCPA)',
      status: 'compliant',
      contracts: 47,
      lastAudit: '2 days ago',
      issues: 0,
      requirements: [
        { name: 'Data Privacy Notice', status: 'compliant', contracts: 47 },
        { name: 'Right to Delete', status: 'compliant', contracts: 45 },
        { name: 'Do Not Sell Clause', status: 'compliant', contracts: 42 },
        { name: 'Data Breach Notification', status: 'compliant', contracts: 47 }
      ]
    },
    {
      jurisdiction: 'European Union (GDPR)',
      status: 'warning',
      contracts: 34,
      lastAudit: '5 days ago',
      issues: 2,
      requirements: [
        { name: 'Data Processing Agreement', status: 'compliant', contracts: 34 },
        { name: 'Right to be Forgotten', status: 'warning', contracts: 32 },
        { name: 'Data Transfer Clauses', status: 'compliant', contracts: 34 },
        { name: 'Lawful Basis Statement', status: 'warning', contracts: 30 }
      ]
    },
    {
      jurisdiction: 'New York (SHIELD Act)',
      status: 'compliant',
      contracts: 28,
      lastAudit: '1 week ago',
      issues: 0,
      requirements: [
        { name: 'Data Security Requirements', status: 'compliant', contracts: 28 },
        { name: 'Breach Notification', status: 'compliant', contracts: 28 },
        { name: 'Reasonable Safeguards', status: 'compliant', contracts: 28 }
      ]
    },
    {
      jurisdiction: 'Financial (SOX, FINRA)',
      status: 'critical',
      contracts: 12,
      lastAudit: '3 weeks ago',
      issues: 4,
      requirements: [
        { name: 'Financial Controls', status: 'critical', contracts: 8 },
        { name: 'Audit Trail Requirements', status: 'warning', contracts: 10 },
        { name: 'Record Retention', status: 'compliant', contracts: 12 }
      ]
    }
  ];

  // Active compliance alerts
  const alerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'GDPR Compliance Gap Detected',
      description: '2 contracts missing "Right to be Forgotten" clause',
      affectedContracts: ['Contract-2045', 'Contract-2087'],
      deadline: '14 days',
      recommendation: 'Add standard GDPR deletion rights clause'
    },
    {
      id: 2,
      severity: 'critical',
      title: 'Financial Controls Non-Compliant',
      description: '4 contracts lack required SOX financial controls',
      affectedContracts: ['Contract-3012', 'Contract-3045', 'Contract-3098', 'Contract-3112'],
      deadline: '7 days',
      recommendation: 'Implement standard financial control clauses immediately'
    },
    {
      id: 3,
      severity: 'warning',
      title: 'CCPA Update Required',
      description: 'New California regulations effective Feb 1, 2026',
      affectedContracts: ['All CA-based contracts (47)'],
      deadline: '25 days',
      recommendation: 'Review and update data collection disclosures'
    },
    {
      id: 4,
      severity: 'info',
      title: 'Upcoming GDPR Audit',
      description: 'Quarterly compliance audit scheduled',
      affectedContracts: ['All EU contracts (34)'],
      deadline: '45 days',
      recommendation: 'Prepare documentation and review contract clauses'
    }
  ];

  // Recent regulatory changes
  const regulatoryChanges = [
    {
      date: '2026-01-05',
      regulation: 'CCPA Amendment',
      jurisdiction: 'California',
      impact: 'high',
      summary: 'New requirements for automated decision-making disclosure',
      action: 'Update 47 contracts',
      status: 'pending'
    },
    {
      date: '2025-12-20',
      regulation: 'GDPR Update',
      jurisdiction: 'European Union',
      impact: 'medium',
      summary: 'Clarified data transfer requirements post-Schrems II',
      action: 'Review data processing agreements',
      status: 'in-progress'
    },
    {
      date: '2025-12-01',
      regulation: 'AI Regulation',
      jurisdiction: 'European Union',
      impact: 'high',
      summary: 'New AI Act requirements for automated contract analysis',
      action: 'Add AI usage disclosures',
      status: 'completed'
    }
  ];

  // Compliance score
  const overallScore = 87;
  const scoreChange = -3; // vs last quarter

  const getStatusColor = (status: string) => {
    const colors = {
      compliant: 'text-green-600 bg-green-100 border-green-300',
      warning: 'text-yellow-600 bg-yellow-100 border-yellow-300',
      critical: 'text-red-600 bg-red-100 border-red-300'
    };
    return colors[status as keyof typeof colors] || colors.warning;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'compliant') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      info: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[severity as keyof typeof colors] || colors.info;
  };

  return (
    <div className="min-h-screen bg-stone-50 light-section-pattern">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-12 dark-section-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-stone-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Compliance Monitoring</h1>
              <p className="text-stone-300 text-sm uppercase tracking-wider mono mt-1">Real-Time Regulatory Compliance Tracking</p>
            </div>
          </div>
          <p className="text-xl text-stone-300 max-w-3xl">
            Automatic scanning for regulatory compliance across multiple jurisdictions with real-time alerts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Compliance Score Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-2 border-blue-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm mb-1">Overall Compliance Score</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-bold">{overallScore}%</p>
                  <div className={`flex items-center gap-1 ${scoreChange < 0 ? 'text-red-200' : 'text-green-200'}`}>
                    {scoreChange < 0 ? <TrendingUp className="w-4 h-4 rotate-180" /> : <TrendingUp className="w-4 h-4" />}
                    <span className="text-sm font-bold">{Math.abs(scoreChange)}% vs last quarter</span>
                  </div>
                </div>
              </div>
              <div className="w-24 h-24 relative">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-500">
              <div>
                <p className="text-blue-100 text-xs mb-1">Compliant</p>
                <p className="text-2xl font-bold">121</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Warnings</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Critical</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Globe className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Jurisdictions</p>
            <p className="text-3xl font-bold text-stone-900 mb-2">8</p>
            <p className="text-sm text-stone-600">Actively monitored</p>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Bell className="w-8 h-8 text-yellow-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Active Alerts</p>
            <p className="text-3xl font-bold text-stone-900 mb-2">{alerts.length}</p>
            <p className="text-sm text-stone-600">Require attention</p>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Active Compliance Alerts</h2>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className={`border-2 rounded-xl p-6 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {alert.severity === 'critical' && <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />}
                    {alert.severity === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />}
                    {alert.severity === 'info' && <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{alert.title}</h3>
                      <p className="text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="font-mono">
                          {alert.affectedContracts.length > 3 
                            ? `${alert.affectedContracts.length} contracts affected`
                            : `Affects: ${alert.affectedContracts.join(', ')}`}
                        </span>
                        <span className="px-2 py-1 bg-white rounded border font-semibold">
                          ⏰ {alert.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded border font-semibold ${
                      alert.severity === 'critical' ? 'bg-red-200 text-red-900 border-red-400' :
                      alert.severity === 'warning' ? 'bg-yellow-200 text-yellow-900 border-yellow-400' :
                      'bg-blue-200 text-blue-900 border-blue-400'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="bg-white/50 border-l-4 border-current p-4 rounded">
                  <p className="text-sm font-semibold mb-1">💡 Recommended Action:</p>
                  <p className="text-sm">{alert.recommendation}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors text-sm">
                    Fix Now
                  </button>
                  <button className="px-4 py-2 border-2 border-stone-900 text-stone-900 rounded-lg font-semibold hover:bg-stone-50 transition-colors text-sm">
                    View Contracts
                  </button>
                  <button className="px-4 py-2 border-2 border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50 transition-colors text-sm">
                    Snooze
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jurisdiction Compliance */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Compliance by Jurisdiction</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {jurisdictionCompliance.map((jurisdiction, idx) => (
              <div key={idx} className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(jurisdiction.status)}
                    <div>
                      <h3 className="font-bold text-stone-900">{jurisdiction.jurisdiction}</h3>
                      <p className="text-sm text-stone-500">{jurisdiction.contracts} contracts • Last audit: {jurisdiction.lastAudit}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border font-semibold ${getStatusColor(jurisdiction.status)}`}>
                    {jurisdiction.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2">
                  {jurisdiction.requirements.map((req, reqIdx) => (
                    <div key={reqIdx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex items-center gap-2 flex-1">
                        {req.status === 'compliant' && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                        {req.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />}
                        {req.status === 'critical' && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                        <span className="text-sm font-medium text-stone-700">{req.name}</span>
                      </div>
                      <span className="text-xs text-stone-500 font-mono">{req.contracts} contracts</span>
                    </div>
                  ))}
                </div>

                {jurisdiction.issues > 0 && (
                  <div className="mt-4 pt-4 border-t border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-red-700">
                        {jurisdiction.issues} issue{jurisdiction.issues > 1 ? 's' : ''} require attention
                      </span>
                      <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        View Details →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Changes */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Recent Regulatory Changes</h2>
          <div className="bg-white border-2 border-stone-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 border-b-2 border-stone-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Regulation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Jurisdiction</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Impact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Action Required</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {regulatoryChanges.map((change, idx) => (
                    <tr key={idx} className="border-b border-stone-200 hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-stone-700">{change.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-stone-900">{change.regulation}</p>
                        <p className="text-xs text-stone-500 mt-1">{change.summary}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-stone-700">{change.jurisdiction}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded border font-semibold ${
                          change.impact === 'high' ? 'bg-red-100 text-red-700 border-red-300' :
                          change.impact === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                          'bg-blue-100 text-blue-700 border-blue-300'
                        }`}>
                          {change.impact.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-stone-700">{change.action}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded border font-semibold ${
                          change.status === 'completed' ? 'bg-green-100 text-green-700 border-green-300' :
                          change.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                          'bg-stone-100 text-stone-700 border-stone-300'
                        }`}>
                          {change.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
