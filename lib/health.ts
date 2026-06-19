/**
 * System Health Check and Testing Utilities
 * 
 * Features:
 * - Automated health checks
 * - System diagnostics
 * - Performance benchmarks
 * - Security audits
 * - Database integrity checks
 */

import { db } from './database';
import { performanceMonitor } from './performance';
import { rateLimiter } from './security';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    name: string;
    status: 'pass' | 'warn' | 'fail';
    message: string;
    duration: number;
  }[];
  timestamp: number;
  version: string;
}

export interface SystemDiagnostics {
  storage: {
    used: number;
    available: number;
    percentage: number;
    items: number;
  };
  performance: {
    avgRenderTime: number;
    avgAPITime: number;
    p95RenderTime: number;
    p95APITime: number;
  };
  errors: {
    total: number;
    last24h: number;
    byCategory: Record<string, number>;
  };
  analytics: {
    sessions: number;
    pageViews: number;
    conversions: number;
    bounceRate: number;
  };
}

/**
 * Run comprehensive health check
 */
export async function runHealthCheck(): Promise<HealthCheckResult> {
  const checks: HealthCheckResult['checks'] = [];
  const startTime = Date.now();

  // Check 1: LocalStorage availability
  try {
    const start = performance.now();
    const testKey = '__health_check_test';
    localStorage.setItem(testKey, 'test');
    const value = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    checks.push({
      name: 'localStorage',
      status: value === 'test' ? 'pass' : 'fail',
      message: value === 'test' ? 'Storage is working correctly' : 'Storage test failed',
      duration: performance.now() - start,
    });
  } catch (error) {
    checks.push({
      name: 'localStorage',
      status: 'fail',
      message: `Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: 0,
    });
  }

  // Check 2: Database operations
  try {
    const start = performance.now();
    const testItem = { id: crypto.randomUUID(), test: true, timestamp: Date.now() };
    
    db.insert('__health_check', testItem);
    const retrieved = db.getAllItems<typeof testItem>('__health_check').find((item: any) => item.id === testItem.id);
    db.delete('__health_check', testItem.id);
    
    checks.push({
      name: 'database',
      status: retrieved ? 'pass' : 'fail',
      message: retrieved ? 'Database operations working' : 'Database test failed',
      duration: performance.now() - start,
    });
  } catch (error) {
    checks.push({
      name: 'database',
      status: 'fail',
      message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: 0,
    });
  }

  // Check 3: Performance metrics
  try {
    const start = performance.now();
    const avgRender = performanceMonitor.getAverage('component_render', 60000);
    const avgAPI = performanceMonitor.getAverage('api_request', 60000);
    
    let status: 'pass' | 'warn' | 'fail' = 'pass';
    let message = 'Performance metrics within acceptable range';

    if (avgRender > 50 || avgAPI > 2000) {
      status = 'warn';
      message = 'Performance metrics showing degradation';
    }

    if (avgRender > 100 || avgAPI > 5000) {
      status = 'fail';
      message = 'Performance metrics critically slow';
    }

    checks.push({
      name: 'performance',
      status,
      message,
      duration: performance.now() - start,
    });
  } catch (error) {
    checks.push({
      name: 'performance',
      status: 'warn',
      message: 'Could not retrieve performance metrics',
      duration: 0,
    });
  }

  // Check 4: Storage capacity
  try {
    const start = performance.now();
    const stats = db.getStorageStats();
    
    let status: 'pass' | 'warn' | 'fail' = 'pass';
    let message = `Storage: ${stats.percentage.toFixed(1)}% used`;

    if (stats.percentage > 80) {
      status = 'warn';
      message = `Storage nearing capacity: ${stats.percentage.toFixed(1)}%`;
    }

    if (stats.percentage > 95) {
      status = 'fail';
      message = `Storage critically full: ${stats.percentage.toFixed(1)}%`;
    }

    checks.push({
      name: 'storage',
      status,
      message,
      duration: performance.now() - start,
    });
  } catch (error) {
    checks.push({
      name: 'storage',
      status: 'warn',
      message: 'Could not check storage capacity',
      duration: 0,
    });
  }

  // Check 5: Error rate
  try {
    const start = performance.now();
    const errors = db.getAllItems<any>('securityLogs').filter(
      log => log.severity === 'error' || log.severity === 'critical'
    );
    
    const recent = errors.filter(
      log => Date.now() - log.timestamp < 60000 // Last minute
    );

    let status: 'pass' | 'warn' | 'fail' = 'pass';
    let message = `${recent.length} errors in last minute`;

    if (recent.length > 5) {
      status = 'warn';
      message = `Elevated error rate: ${recent.length} errors in last minute`;
    }

    if (recent.length > 20) {
      status = 'fail';
      message = `Critical error rate: ${recent.length} errors in last minute`;
    }

    checks.push({
      name: 'errors',
      status,
      message,
      duration: performance.now() - start,
    });
  } catch (error) {
    checks.push({
      name: 'errors',
      status: 'warn',
      message: 'Could not check error rate',
      duration: 0,
    });
  }

  // Determine overall status
  const hasFailures = checks.some(c => c.status === 'fail');
  const hasWarnings = checks.some(c => c.status === 'warn');

  const overallStatus: HealthCheckResult['status'] = hasFailures
    ? 'unhealthy'
    : hasWarnings
    ? 'degraded'
    : 'healthy';

  return {
    status: overallStatus,
    checks,
    timestamp: Date.now(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  };
}

/**
 * Get system diagnostics
 */
export function getSystemDiagnostics(): SystemDiagnostics {
  const storage = db.getStorageStats();

  const avgRender = performanceMonitor.getAverage('component_render', 3600000); // Last hour
  const avgAPI = performanceMonitor.getAverage('api_request', 3600000);
  const p95Render = performanceMonitor.getPercentile('component_render', 95, 3600000);
  const p95API = performanceMonitor.getPercentile('api_request', 95, 3600000);

  const allLogs = db.getAllItems<any>('securityLogs');
  const last24h = allLogs.filter(log => Date.now() - log.timestamp < 86400000);
  
  const errorsByCategory: Record<string, number> = {};
  last24h.forEach(log => {
    const category = log.event || 'unknown';
    errorsByCategory[category] = (errorsByCategory[category] || 0) + 1;
  });

  const sessions = db.getAllItems<any>('userSessions');
  const recentSessions = sessions.filter(s => Date.now() - s.startTime < 86400000);
  const totalPageViews = recentSessions.reduce((sum, s) => sum + (s.pageViews || 0), 0);
  const totalConversions = recentSessions.reduce((sum, s) => sum + (s.conversions || 0), 0);
  const bouncedSessions = recentSessions.filter(s => s.pageViews === 1 && s.interactions === 0);
  const bounceRate = recentSessions.length > 0
    ? (bouncedSessions.length / recentSessions.length) * 100
    : 0;

  return {
    storage,
    performance: {
      avgRenderTime: avgRender,
      avgAPITime: avgAPI,
      p95RenderTime: p95Render,
      p95APITime: p95API,
    },
    errors: {
      total: allLogs.length,
      last24h: last24h.length,
      byCategory: errorsByCategory,
    },
    analytics: {
      sessions: recentSessions.length,
      pageViews: totalPageViews,
      conversions: totalConversions,
      bounceRate,
    },
  };
}

/**
 * Run performance benchmark
 */
export async function runPerformanceBenchmark(): Promise<{
  renders: number[];
  database: {
    insert: number[];
    read: number[];
    update: number[];
    delete: number[];
  };
  storage: {
    write: number[];
    read: number[];
  };
}> {
  const results = {
    renders: [] as number[],
    database: {
      insert: [] as number[],
      read: [] as number[],
      update: [] as number[],
      delete: [] as number[],
    },
    storage: {
      write: [] as number[],
      read: [] as number[],
    },
  };

  // Benchmark renders (simulate)
  for (let i = 0; i < 10; i++) {
    const start = performance.now();
    // Simulate render work
    const arr = new Array(1000).fill(0).map((_, i) => i * 2);
    arr.sort((a, b) => b - a);
    results.renders.push(performance.now() - start);
  }

  // Benchmark database operations
  for (let i = 0; i < 10; i++) {
    const testItem = { id: crypto.randomUUID(), value: Math.random() };

    // Insert
    let start = performance.now();
    db.insert('__benchmark', testItem);
    results.database.insert.push(performance.now() - start);

    // Read
    start = performance.now();
    db.getAllItems('__benchmark');
    results.database.read.push(performance.now() - start);

    // Update
    start = performance.now();
    db.update('__benchmark', testItem.id, { value: Math.random() } as any);
    results.database.update.push(performance.now() - start);

    // Delete
    start = performance.now();
    db.delete('__benchmark', testItem.id);
    results.database.delete.push(performance.now() - start);
  }

  // Benchmark storage operations
  for (let i = 0; i < 10; i++) {
    const testData = JSON.stringify({ value: Math.random() });

    // Write
    let start = performance.now();
    localStorage.setItem(`__benchmark_${i}`, testData);
    results.storage.write.push(performance.now() - start);

    // Read
    start = performance.now();
    localStorage.getItem(`__benchmark_${i}`);
    results.storage.read.push(performance.now() - start);

    // Cleanup
    localStorage.removeItem(`__benchmark_${i}`);
  }

  return results;
}

/**
 * Validate system integrity
 */
export async function validateSystemIntegrity(): Promise<{
  valid: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  // Check critical collections exist
  const criticalCollections = ['signatureRequests', 'userSessions', 'analyticsEvents'];
  criticalCollections.forEach(collection => {
    try {
      db.getAllItems(collection);
    } catch (error) {
      issues.push(`Critical collection '${collection}' is corrupted or missing`);
    }
  });

  // Check storage integrity
  try {
    const stats = db.getStorageStats();
    if (stats.percentage > 99) {
      issues.push('Storage is at maximum capacity');
    }
  } catch (error) {
    issues.push('Cannot access storage statistics');
  }

  // Check for data corruption
  try {
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value && !key.startsWith('__')) {
          JSON.parse(value);
        }
      } catch (error) {
        issues.push(`Corrupted data in key: ${key}`);
      }
    });
  } catch (error) {
    issues.push('Cannot validate data integrity');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Generate system report
 */
export async function generateSystemReport(): Promise<string> {
  const health = await runHealthCheck();
  const diagnostics = getSystemDiagnostics();
  const integrity = await validateSystemIntegrity();

  const report = `
# System Health Report
Generated: ${new Date().toISOString()}
Version: ${health.version}

## Overall Status: ${health.status.toUpperCase()}

## Health Checks
${health.checks.map(check => `
### ${check.name}
- Status: ${check.status.toUpperCase()}
- Message: ${check.message}
- Duration: ${check.duration.toFixed(2)}ms
`).join('\n')}

## System Diagnostics

### Storage
- Used: ${(diagnostics.storage.used / 1024).toFixed(2)} KB
- Available: ${(diagnostics.storage.available / 1024).toFixed(2)} KB
- Percentage: ${diagnostics.storage.percentage.toFixed(2)}%
- Items: ${diagnostics.storage.items}

### Performance
- Avg Render Time: ${diagnostics.performance.avgRenderTime.toFixed(2)}ms
- Avg API Time: ${diagnostics.performance.avgAPITime.toFixed(2)}ms
- P95 Render Time: ${diagnostics.performance.p95RenderTime.toFixed(2)}ms
- P95 API Time: ${diagnostics.performance.p95APITime.toFixed(2)}ms

### Errors (Last 24h)
- Total Errors: ${diagnostics.errors.last24h}
- By Category:
${Object.entries(diagnostics.errors.byCategory)
  .map(([cat, count]) => `  - ${cat}: ${count}`)
  .join('\n')}

### Analytics (Last 24h)
- Sessions: ${diagnostics.analytics.sessions}
- Page Views: ${diagnostics.analytics.pageViews}
- Conversions: ${diagnostics.analytics.conversions}
- Bounce Rate: ${diagnostics.analytics.bounceRate.toFixed(2)}%

## Integrity Check
- Valid: ${integrity.valid ? 'YES' : 'NO'}
${integrity.issues.length > 0 ? `
- Issues:
${integrity.issues.map(issue => `  - ${issue}`).join('\n')}
` : ''}
`;

  return report.trim();
}
