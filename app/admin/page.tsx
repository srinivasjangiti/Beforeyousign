'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Target
} from 'lucide-react';
import { runHealthCheck, getSystemDiagnostics, generateSystemReport, type HealthCheckResult, type SystemDiagnostics } from '@/lib/health';
import { db } from '@/lib/database';
import { performanceMonitor } from '@/lib/performance';

export default function AdminDashboard() {
  const [healthCheck, setHealthCheck] = useState<HealthCheckResult | null>(null);
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const health = await runHealthCheck();
      const diag = getSystemDiagnostics();
      
      setHealthCheck(health);
      setDiagnostics(diag);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading diagnostics:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const downloadReport = async () => {
    const report = await generateSystemReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportData = () => {
    const data = db.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearCache = () => {
    if (confirm('Are you sure you want to clear the performance cache?')) {
      performanceMonitor.clear();
      loadData();
    }
  };

  const getStatusColor = (status: 'healthy' | 'degraded' | 'unhealthy' | 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'healthy':
      case 'pass':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
      case 'warn':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unhealthy':
      case 'fail':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warn':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  if (loading && !healthCheck) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">
                System Diagnostics
              </h1>
              <p className="text-stone-600">
                Real-time system health and performance monitoring
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-stone-300 rounded-lg font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Report
              </button>
            </div>
          </div>
          
          <div className="text-sm text-stone-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* Overall Status */}
        {healthCheck && (
          <div className={`mb-8 p-6 rounded-xl border-2 ${getStatusColor(healthCheck.status)}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                {healthCheck.status === 'healthy' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : healthCheck.status === 'degraded' ? (
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold capitalize">
                  System Status: {healthCheck.status}
                </h2>
                <p className="text-sm opacity-75 mt-1">
                  Version {healthCheck.version} • {healthCheck.checks.filter(c => c.status === 'pass').length}/{healthCheck.checks.length} checks passed
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Health Checks */}
        {healthCheck && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-4">Health Checks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthCheck.checks.map((check, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border-2 border-stone-200 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <h3 className="font-semibold text-stone-900 capitalize">
                        {check.name.replace(/_/g, ' ')}
                      </h3>
                    </div>
                    <span className="text-xs text-stone-500">
                      {check.duration.toFixed(1)}ms
                    </span>
                  </div>
                  <p className="text-sm text-stone-600">{check.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Metrics */}
        {diagnostics && (
          <>
            {/* Storage */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Storage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">
                    {(diagnostics.storage.used / 1024).toFixed(1)} KB
                  </div>
                  <div className="text-sm text-stone-600 mt-1">Used</div>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">
                    {(diagnostics.storage.available / 1024).toFixed(1)} KB
                  </div>
                  <div className="text-sm text-stone-600 mt-1">Available</div>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">
                    {diagnostics.storage.percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-stone-600 mt-1">Usage</div>
                  <div className="mt-2 bg-stone-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        diagnostics.storage.percentage > 80
                          ? 'bg-red-600'
                          : diagnostics.storage.percentage > 50
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(diagnostics.storage.percentage, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">
                    {diagnostics.storage.items}
                  </div>
                  <div className="text-sm text-stone-600 mt-1">Items</div>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Performance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-stone-900">
                      {diagnostics.performance.avgRenderTime.toFixed(1)}ms
                    </div>
                    {diagnostics.performance.avgRenderTime > 16.67 ? (
                      <TrendingUp className="w-5 h-5 text-red-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="text-sm text-stone-600">Avg Render Time</div>
                  <div className="text-xs text-stone-500 mt-1">Target: 16.67ms</div>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-stone-900">
                      {diagnostics.performance.avgAPITime.toFixed(0)}ms
                    </div>
                    {diagnostics.performance.avgAPITime > 1000 ? (
                      <TrendingUp className="w-5 h-5 text-red-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="text-sm text-stone-600">Avg API Time</div>
                  <div className="text-xs text-stone-500 mt-1">Target: &lt;1000ms</div>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">
                    {diagnostics.performance.p95RenderTime.toFixed(1)}ms
                  </div>
                  <div className="text-sm text-stone-600 mt-1">P95 Render</div>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">
                    {diagnostics.performance.p95APITime.toFixed(0)}ms
                  </div>
                  <div className="text-sm text-stone-600 mt-1">P95 API</div>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Analytics (Last 24h)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div className="text-2xl font-bold text-stone-900">
                      {diagnostics.analytics.sessions}
                    </div>
                  </div>
                  <div className="text-sm text-stone-600">Sessions</div>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <div className="text-2xl font-bold text-stone-900">
                      {diagnostics.analytics.pageViews}
                    </div>
                  </div>
                  <div className="text-sm text-stone-600">Page Views</div>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <div className="text-2xl font-bold text-stone-900">
                      {diagnostics.analytics.conversions}
                    </div>
                  </div>
                  <div className="text-sm text-stone-600">Conversions</div>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">
                    {diagnostics.analytics.bounceRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-stone-600 mt-1">Bounce Rate</div>
                </div>
              </div>
            </div>

            {/* Errors */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Errors
              </h2>
              <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <div className="text-3xl font-bold text-stone-900">
                      {diagnostics.errors.total}
                    </div>
                    <div className="text-sm text-stone-600 mt-1">Total</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-stone-900">
                      {diagnostics.errors.last24h}
                    </div>
                    <div className="text-sm text-stone-600 mt-1">Last 24h</div>
                  </div>
                </div>

                {Object.keys(diagnostics.errors.byCategory).length > 0 && (
                  <>
                    <h3 className="font-semibold text-stone-900 mb-3">By Category</h3>
                    <div className="space-y-2">
                      {Object.entries(diagnostics.errors.byCategory).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                          <span className="text-sm text-stone-700 capitalize">
                            {category.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm font-semibold text-stone-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-stone-300 rounded-lg font-medium hover:bg-stone-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Database
          </button>
          <button
            onClick={clearCache}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-stone-300 rounded-lg font-medium hover:bg-stone-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}
