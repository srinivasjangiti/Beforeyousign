'use client';

import { Calendar, Clock, Bell, Mail, AlertTriangle, CalendarCheck, CalendarX, Repeat, DollarSign, TrendingUp, FileText, Download, Eye, Settings } from 'lucide-react';
import { useState } from 'react';

export default function RenewalCalendar() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterUrgency, setFilterUrgency] = useState('all');

  const renewals = [
    { id: 1, name: 'Adobe SaaS Agreement', renewalDate: '2025-12-01', daysUntil: -14, autoRenew: true, value: '$59.99/mo', valueNum: 720, urgency: 'OVERDUE', type: 'SaaS', notificationSet: false },
    { id: 2, name: 'StartupXYZ Freelance Agreement', renewalDate: '2025-01-20', daysUntil: 36, autoRenew: false, value: '$5K', valueNum: 5000, urgency: 'SOON', type: 'Freelance', notificationSet: true },
    { id: 3, name: 'Office Lease Agreement', renewalDate: '2025-09-01', daysUntil: 260, autoRenew: true, value: '$3K/mo', valueNum: 36000, urgency: 'SCHEDULED', type: 'Lease', notificationSet: true },
    { id: 4, name: 'Tech Corp Employment Contract', renewalDate: '2025-06-01', daysUntil: 168, autoRenew: false, value: '$120K/yr', valueNum: 120000, urgency: 'SCHEDULED', type: 'Employment', notificationSet: false },
    { id: 5, name: 'Cloud Services Agreement', renewalDate: '2025-01-10', daysUntil: 26, autoRenew: true, value: '$299/mo', valueNum: 3588, urgency: 'SOON', type: 'SaaS', notificationSet: true },
  ];

  const urgencyConfig = {
    OVERDUE: { 
      bg: 'bg-stone-900', 
      text: 'text-white', 
      border: 'border-stone-900',
      icon: CalendarX,
      badgeBg: 'bg-stone-900'
    },
    URGENT: { 
      bg: 'bg-stone-700', 
      text: 'text-white', 
      border: 'border-stone-700',
      icon: AlertTriangle,
      badgeBg: 'bg-stone-700'
    },
    SOON: { 
      bg: 'bg-stone-100', 
      text: 'text-stone-900', 
      border: 'border-stone-400',
      icon: Clock,
      badgeBg: 'bg-stone-500'
    },
    SCHEDULED: { 
      bg: 'bg-stone-50', 
      text: 'text-stone-700', 
      border: 'border-stone-200',
      icon: CalendarCheck,
      badgeBg: 'bg-stone-300'
    },
  };

  const filteredRenewals = renewals.filter(r => 
    filterUrgency === 'all' || r.urgency === filterUrgency
  );

  const overdueCount = renewals.filter(r => r.urgency === 'OVERDUE').length;
  const next30DaysCount = renewals.filter(r => r.daysUntil >= 0 && r.daysUntil <= 30).length;
  const autoRenewCount = renewals.filter(r => r.autoRenew).length;
  const totalAnnualValue = renewals.reduce((sum, r) => sum + r.valueNum, 0);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">Renewal Calendar</h1>
              <p className="text-stone-600">Track upcoming contract renewals and never miss a deadline</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 font-semibold transition-all ${
                  viewMode === 'list' 
                    ? 'bg-stone-900 text-white' 
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                List View
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 font-semibold transition-all ${
                  viewMode === 'calendar' 
                    ? 'bg-stone-900 text-white' 
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                Calendar View
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-stone-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-stone-900" />
              </div>
              {overdueCount > 0 && <span className="w-3 h-3 bg-stone-900" />}
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">{overdueCount}</p>
            <p className="text-sm font-semibold text-stone-700">Overdue</p>
            <p className="text-xs text-stone-500 mt-1">Requires immediate action</p>
          </div>

          <div className="bg-white border-2 border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-stone-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-stone-900" />
              </div>
              <span className="text-xs font-bold text-stone-900 uppercase">Urgent</span>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">{next30DaysCount}</p>
            <p className="text-sm font-semibold text-stone-700">Next 30 Days</p>
            <p className="text-xs text-stone-500 mt-1">Upcoming renewals</p>
          </div>

          <div className="bg-white border-2 border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-stone-100 flex items-center justify-center">
                <Repeat className="w-6 h-6 text-stone-900" />
              </div>
              <span className="text-xs font-bold text-stone-900 uppercase">Auto</span>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">{autoRenewCount}</p>
            <p className="text-sm font-semibold text-stone-700">Auto-Renewal</p>
            <p className="text-xs text-stone-500 mt-1">Requires review</p>
          </div>

          <div className="bg-white border-2 border-stone-200 p-6 hover:border-stone-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-stone-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-stone-900" />
              </div>
              <TrendingUp className="w-4 h-4 text-stone-900" />
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-1">${(totalAnnualValue / 1000).toFixed(0)}K</p>
            <p className="text-sm font-semibold text-stone-700">Annual Value</p>
            <p className="text-xs text-stone-500 mt-1">Total renewal value</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-stone-200 p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-stone-700">Filter by:</span>
            <button
              onClick={() => setFilterUrgency('all')}
              className={`px-4 py-2 text-sm font-semibold transition-all ${
                filterUrgency === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All ({renewals.length})
            </button>
            {Object.keys(urgencyConfig).map((urgency) => {
              const count = renewals.filter(r => r.urgency === urgency).length;
              const config = urgencyConfig[urgency as keyof typeof urgencyConfig];
              return (
                <button
                  key={urgency}
                  onClick={() => setFilterUrgency(urgency)}
                  className={`px-4 py-2 text-sm font-semibold transition-all ${
                    filterUrgency === urgency
                      ? `${config.bg} ${config.text} border-2 ${config.border}`
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {urgency} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Renewals List */}
        <div className="space-y-4">
          {filteredRenewals.map((renewal) => {
            const config = urgencyConfig[renewal.urgency as keyof typeof urgencyConfig];
            const UrgencyIcon = config.icon;
            
            return (
              <div 
                key={renewal.id} 
                className={`bg-white border-2 ${config.border} rounded-xl p-6 hover:shadow-xl transition-all group`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <UrgencyIcon className={`w-6 h-6 ${config.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-stone-900">{renewal.name}</h3>
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs font-semibold rounded">
                          {renewal.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-stone-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Renews: <strong className="text-stone-900">{renewal.renewalDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-stone-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">
                            {renewal.daysUntil > 0 
                              ? `${renewal.daysUntil} days remaining` 
                              : `${Math.abs(renewal.daysUntil)} days overdue`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-stone-900">{renewal.value}</span>
                        </div>
                        {renewal.notificationSet && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                            <Bell className="w-3 h-3" />
                            Reminder Set
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 text-xs font-bold rounded-lg border-2 ${config.bg} ${config.text} ${config.border}`}>
                    {renewal.urgency}
                  </span>
                </div>

                {/* Auto-Renewal Warning */}
                {renewal.autoRenew && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Repeat className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-amber-900 font-semibold mb-1">
                          ⚠️ Auto-Renewal Active
                        </p>
                        <p className="text-sm text-amber-800">
                          This contract will automatically renew unless you take action before the renewal date.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-all shadow-md hover:shadow-lg">
                    <Bell className="w-4 h-4" />
                    {renewal.notificationSet ? 'Update Reminder' : 'Set Reminder'}
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-stone-300 rounded-lg font-semibold hover:bg-stone-50 transition-colors">
                    <Mail className="w-4 h-4" />
                    Email Notification
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-stone-300 rounded-lg font-semibold hover:bg-stone-50 transition-colors">
                    <Calendar className="w-4 h-4" />
                    Add to Calendar
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-blue-300 text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    <Eye className="w-4 h-4" />
                    View Contract
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRenewals.length === 0 && (
          <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
            <CalendarCheck className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-stone-900 mb-2">No renewals in this category</p>
            <p className="text-stone-500">Try selecting a different filter</p>
          </div>
        )}

        {/* Summary */}
        {filteredRenewals.length > 0 && (
          <div className="mt-6 text-center text-sm text-stone-600">
            Showing <span className="font-bold text-stone-900">{filteredRenewals.length}</span> of <span className="font-bold text-stone-900">{renewals.length}</span> contracts
          </div>
        )}
      </div>
    </div>
  );
}
