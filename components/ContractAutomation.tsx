'use client';

import { useState } from 'react';
import {
  Zap,
  PlayCircle,
  Settings,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  Code,
  GitBranch,
  Target,
  Workflow,
  Timer,
  Bot,
  TrendingUp,
  Gauge
} from 'lucide-react';

export default function ContractAutomation() {
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);

  // Active automations
  const activeAutomations = [
    {
      id: 1,
      name: 'Auto-Renewal Processing',
      description: 'Automatically process contract renewals and send notifications',
      status: 'active',
      trigger: 'Schedule: 30 days before expiry',
      actions: ['Send renewal notice', 'Update status', 'Create approval workflow'],
      executions: 156,
      successRate: 98.7,
      avgTime: '2.3s',
      lastRun: '2 hours ago',
      nextRun: 'In 4 hours'
    },
    {
      id: 2,
      name: 'Compliance Checker',
      description: 'Scan new contracts for regulatory compliance issues',
      status: 'active',
      trigger: 'Event: New contract uploaded',
      actions: ['Extract clauses', 'Check GDPR compliance', 'Flag missing clauses', 'Generate report'],
      executions: 89,
      successRate: 95.5,
      avgTime: '5.1s',
      lastRun: '15 minutes ago',
      nextRun: 'On demand'
    },
    {
      id: 3,
      name: 'Risk Escalation',
      description: 'Escalate high-risk contracts to legal team',
      status: 'active',
      trigger: 'Event: Risk score > 7.5',
      actions: ['Notify legal team', 'Block auto-approval', 'Request review', 'Schedule meeting'],
      executions: 23,
      successRate: 100,
      avgTime: '1.2s',
      lastRun: '1 day ago',
      nextRun: 'On demand'
    },
    {
      id: 4,
      name: 'Invoice Generation',
      description: 'Auto-generate invoices for milestone-based contracts',
      status: 'active',
      trigger: 'Event: Milestone completed',
      actions: ['Calculate amount', 'Generate PDF invoice', 'Send to client', 'Update accounting'],
      executions: 67,
      successRate: 96.2,
      avgTime: '8.7s',
      lastRun: '6 hours ago',
      nextRun: 'On demand'
    },
    {
      id: 5,
      name: 'Approval Routing',
      description: 'Route contracts to appropriate approvers based on value/type',
      status: 'paused',
      trigger: 'Event: Contract submitted for approval',
      actions: ['Analyze contract type', 'Determine approver', 'Send notification', 'Set deadline'],
      executions: 245,
      successRate: 99.1,
      avgTime: '0.8s',
      lastRun: '2 days ago',
      nextRun: 'Paused'
    }
  ];

  // Automation templates
  const templates = [
    {
      category: 'Document Processing',
      automations: [
        { name: 'Auto-Extract Metadata', description: 'Extract parties, dates, values from uploads', icon: Code },
        { name: 'Version Comparison', description: 'Compare new versions with originals automatically', icon: GitBranch },
        { name: 'Clause Library Sync', description: 'Extract and catalog clauses to library', icon: Workflow }
      ]
    },
    {
      category: 'Compliance & Risk',
      automations: [
        { name: 'Regulatory Scanner', description: 'Scan for jurisdiction-specific requirements', icon: Target },
        { name: 'Risk Assessment', description: 'Auto-calculate risk scores on upload', icon: AlertTriangle },
        { name: 'Expiry Alerts', description: 'Send alerts 90/60/30 days before expiry', icon: Calendar }
      ]
    },
    {
      category: 'Workflow Automation',
      automations: [
        { name: 'Approval Chains', description: 'Multi-level approval based on contract value', icon: CheckCircle },
        { name: 'Signature Reminders', description: 'Auto-remind unsigned parties every 3 days', icon: Timer },
        { name: 'Status Updates', description: 'Post status changes to Slack/Teams', icon: Bot }
      ]
    }
  ];

  // Recent execution log
  const executionLog = [
    {
      time: '2 hours ago',
      automation: 'Auto-Renewal Processing',
      status: 'success',
      contract: 'Contract-4567',
      duration: '2.1s',
      actions: 3
    },
    {
      time: '2 hours ago',
      automation: 'Auto-Renewal Processing',
      status: 'success',
      contract: 'Contract-4589',
      duration: '2.5s',
      actions: 3
    },
    {
      time: '15 minutes ago',
      automation: 'Compliance Checker',
      status: 'warning',
      contract: 'Contract-5012',
      duration: '5.8s',
      actions: 4,
      message: 'Missing GDPR data processing clause'
    },
    {
      time: '6 hours ago',
      automation: 'Invoice Generation',
      status: 'success',
      contract: 'Contract-3456',
      duration: '9.2s',
      actions: 4
    },
    {
      time: '1 day ago',
      automation: 'Risk Escalation',
      status: 'success',
      contract: 'Contract-2890',
      duration: '1.1s',
      actions: 4
    }
  ];

  // Stats
  const stats = {
    totalExecutions: 580,
    avgSuccessRate: 97.9,
    timeSaved: '127.5 hours',
    activeAutomations: 4
  };

  return (
    <div className="min-h-screen bg-stone-50 light-section-pattern">
      {/* Header */}
      <div className="bg-stone-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Contract Automation</h1>
              <p className="text-stone-400 text-sm uppercase tracking-wider mono mt-1">Workflow Automation Engine</p>
            </div>
          </div>
          <p className="text-xl text-stone-300 max-w-3xl">
            Automate repetitive contract tasks with intelligent workflows. Save time, reduce errors, and scale effortlessly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Workflow className="w-8 h-8 text-stone-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Active Automations</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">{stats.activeAutomations}</p>
            <p className="text-sm text-stone-600">Running workflows</p>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <PlayCircle className="w-8 h-8 text-stone-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Total Executions</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">{stats.totalExecutions}</p>
            <p className="text-sm text-stone-600">This month</p>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Gauge className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">{stats.avgSuccessRate}%</p>
            <p className="text-sm text-stone-600">Average across all</p>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Clock className="w-8 h-8 text-orange-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Time Saved</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">{stats.timeSaved}</p>
            <p className="text-sm text-stone-600">Estimated this month</p>
          </div>
        </div>

        {/* Active Automations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-stone-900">Active Automations</h2>
            <button className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Automation
            </button>
          </div>

          <div className="space-y-4">
            {activeAutomations.map(automation => (
              <div 
                key={automation.id} 
                className={`bg-white border-2 rounded-xl p-6 transition-all cursor-pointer ${
                  selectedAutomation === automation.name 
                    ? 'border-stone-900 shadow-lg' 
                    : 'border-stone-200 hover:border-stone-900'
                }`}
                onClick={() => setSelectedAutomation(automation.name)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-stone-900">{automation.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded border font-semibold ${
                        automation.status === 'active' 
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                      }`}>
                        {automation.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-stone-600 mb-4">{automation.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                        <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Trigger</p>
                        <p className="text-sm font-mono text-stone-700">{automation.trigger}</p>
                      </div>
                      <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                        <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Performance</p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-mono text-stone-700">{automation.executions} runs</span>
                          <span className="text-green-600 font-semibold">{automation.successRate}% success</span>
                          <span className="font-mono text-stone-500">{automation.avgTime} avg</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2">Actions</p>
                      <div className="flex flex-wrap gap-2">
                        {automation.actions.map((action, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-xs px-3 py-1 bg-stone-100 text-stone-700 border border-stone-300 rounded-full">
                            <ArrowRight className="w-3 h-3" />
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-stone-500">
                      <span>Last run: {automation.lastRun}</span>
                      <span>•</span>
                      <span>Next run: {automation.nextRun}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 border-2 border-stone-200 rounded-lg hover:border-stone-900 transition-colors">
                      <Settings className="w-4 h-4 text-stone-600" />
                    </button>
                    {automation.status === 'active' ? (
                      <button className="px-3 py-2 border-2 border-yellow-300 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-50 transition-colors text-sm">
                        Pause
                      </button>
                    ) : (
                      <button className="px-3 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
                        Resume
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Templates Library */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Automation Templates</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {templates.map((category, idx) => (
              <div key={idx} className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
                <h3 className="font-bold text-lg text-stone-900 mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.automations.map((automation, autoIdx) => (
                    <div key={autoIdx} className="p-3 bg-stone-50 border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <automation.icon className="w-5 h-5 text-stone-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-stone-900 group-hover:text-stone-700 transition-colors">{automation.name}</p>
                          <p className="text-xs text-stone-600 mt-1">{automation.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Log */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Recent Executions</h2>
          <div className="bg-white border-2 border-stone-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 border-b-2 border-stone-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Automation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Contract</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Actions</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {executionLog.map((log, idx) => (
                    <tr key={idx} className="border-b border-stone-200 hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm text-stone-700">{log.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-stone-900">{log.automation}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-stone-700">{log.contract}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-stone-600">{log.duration}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-stone-700">{log.actions} actions</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {log.status === 'success' ? (
                            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 border border-green-300 rounded font-semibold">
                              <CheckCircle className="w-3 h-3" />
                              SUCCESS
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded font-semibold">
                              <AlertTriangle className="w-3 h-3" />
                              WARNING
                            </span>
                          )}
                        </div>
                        {log.message && (
                          <p className="text-xs text-stone-500 mt-1">{log.message}</p>
                        )}
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
