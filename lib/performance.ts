/**
 * Performance monitoring and optimization utilities
 * 
 * Features:
 * - React component performance tracking
 * - API response time monitoring
 * - Bundle size analysis
 * - Memory usage tracking
 * - Web Vitals measurement
 */

import { db } from './database';

export interface PerformanceMetric {
  id: string;
  timestamp: number;
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'score';
  category: 'render' | 'api' | 'bundle' | 'memory' | 'vitals';
  metadata?: Record<string, any>;
}

/**
 * Performance Monitor
 */
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 1000;

  /**
   * Record a performance metric
   */
  record(
    name: string,
    value: number,
    category: PerformanceMetric['category'],
    unit: PerformanceMetric['unit'] = 'ms',
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      name,
      value,
      unit,
      category,
      metadata,
    };

    this.metrics.push(metric);

    // Keep only last MAX_METRICS
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }

    // Save to database
    db.insert('performanceMetrics', metric);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${value}${unit}`, metadata);
    }

    // Production: Send to analytics service (Google Analytics, DataDog, Sentry)
  }

  /**
   * Measure function execution time
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.record(name, duration, 'api', 'ms', {
        ...metadata,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      this.record(name, duration, 'api', 'ms', {
        ...metadata,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Measure synchronous function execution time
   */
  measure<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    const start = performance.now();
    
    try {
      const result = fn();
      const duration = performance.now() - start;
      
      this.record(name, duration, 'render', 'ms', metadata);

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      this.record(name, duration, 'render', 'ms', {
        ...metadata,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Get metrics by category
   */
  getMetrics(category?: PerformanceMetric['category']): PerformanceMetric[] {
    if (!category) return this.metrics;
    return this.metrics.filter(m => m.category === category);
  }

  /**
   * Get average metric value
   */
  getAverage(name: string, timeWindowMs: number = 60000): number {
    const now = Date.now();
    const relevant = this.metrics.filter(
      m => m.name === name && now - m.timestamp < timeWindowMs
    );

    if (relevant.length === 0) return 0;

    const sum = relevant.reduce((acc, m) => acc + m.value, 0);
    return sum / relevant.length;
  }

  /**
   * Get percentile metric value
   */
  getPercentile(name: string, percentile: number, timeWindowMs: number = 60000): number {
    const now = Date.now();
    const relevant = this.metrics
      .filter(m => m.name === name && now - m.timestamp < timeWindowMs)
      .map(m => m.value)
      .sort((a, b) => a - b);

    if (relevant.length === 0) return 0;

    const index = Math.ceil((percentile / 100) * relevant.length) - 1;
    return relevant[Math.max(0, index)];
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Export metrics for analysis
   */
  export(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Web Vitals tracking
 */
export interface WebVital {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export function reportWebVitals(metric: WebVital): void {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric);
  }

  // Record in performance monitor
  performanceMonitor.record(
    `web_vital_${metric.name}`,
    metric.value,
    'vitals',
    'score',
    {
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    }
  );

  // Production: Send to analytics (Google Analytics, Mixpanel)
  // Example: gtag('event', metric.name, { value: metric.value, metric_id: metric.id });
}

/**
 * Bundle size analyzer
 */
export function analyzeBundleSize(): void {
  if (typeof window === 'undefined') return;

  const scripts = document.querySelectorAll('script[src]');
  const styles = document.querySelectorAll('link[rel="stylesheet"]');

  let totalScriptSize = 0;
  let totalStyleSize = 0;

  scripts.forEach(async (script) => {
    const src = (script as HTMLScriptElement).src;
    if (!src) return;

    try {
      const response = await fetch(src, { method: 'HEAD' });
      const size = parseInt(response.headers.get('content-length') || '0', 10);
      totalScriptSize += size;

      performanceMonitor.record(
        'bundle_script',
        size,
        'bundle',
        'bytes',
        { src }
      );
    } catch (error) {
      console.error('Error fetching script size:', error);
    }
  });

  styles.forEach(async (style) => {
    const href = (style as HTMLLinkElement).href;
    if (!href) return;

    try {
      const response = await fetch(href, { method: 'HEAD' });
      const size = parseInt(response.headers.get('content-length') || '0', 10);
      totalStyleSize += size;

      performanceMonitor.record(
        'bundle_style',
        size,
        'bundle',
        'bytes',
        { href }
      );
    } catch (error) {
      console.error('Error fetching style size:', error);
    }
  });

  console.log('[Bundle Analysis]', {
    scripts: totalScriptSize,
    styles: totalStyleSize,
    total: totalScriptSize + totalStyleSize,
  });
}

/**
 * Memory usage tracker
 */
export function trackMemoryUsage(): void {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return;
  }

  const memory = (performance as any).memory;
  
  performanceMonitor.record(
    'memory_used',
    memory.usedJSHeapSize,
    'memory',
    'bytes'
  );

  performanceMonitor.record(
    'memory_total',
    memory.totalJSHeapSize,
    'memory',
    'bytes'
  );

  performanceMonitor.record(
    'memory_limit',
    memory.jsHeapSizeLimit,
    'memory',
    'bytes'
  );

  const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

  if (percentage > 90) {
    console.warn(`[Memory] High memory usage: ${percentage.toFixed(1)}%`);
  }
}

/**
 * React component performance wrapper
 */
export function measureComponentRender(
  componentName: string,
  renderFn: () => void
): void {
  const start = performance.now();
  renderFn();
  const duration = performance.now() - start;

  performanceMonitor.record(
    `component_render_${componentName}`,
    duration,
    'render',
    'ms'
  );

  if (duration > 16.67) {
    console.warn(
      `[Performance] ${componentName} render took ${duration.toFixed(2)}ms (target: 16.67ms)`
    );
  }
}

/**
 * API request performance tracker
 */
export async function trackAPIRequest<T>(
  endpoint: string,
  requestFn: () => Promise<T>
): Promise<T> {
  return performanceMonitor.measureAsync(
    `api_request_${endpoint}`,
    requestFn,
    { endpoint }
  );
}

/**
 * Performance budget checker
 */
export interface PerformanceBudget {
  metric: string;
  budget: number;
  unit: 'ms' | 'bytes' | 'score';
}

export function checkPerformanceBudgets(budgets: PerformanceBudget[]): {
  passed: boolean;
  violations: Array<{
    metric: string;
    actual: number;
    budget: number;
    unit: string;
  }>;
} {
  const violations: Array<{
    metric: string;
    actual: number;
    budget: number;
    unit: string;
  }> = [];

  budgets.forEach(({ metric, budget, unit }) => {
    const actual = performanceMonitor.getAverage(metric);

    if (actual > budget) {
      violations.push({ metric, actual, budget, unit });
    }
  });

  if (violations.length > 0) {
    console.warn('[Performance Budget] Violations detected:', violations);
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Lazy loading observer
 */
export function createLazyLoadObserver(
  callback: (element: Element) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  if (typeof window === 'undefined') {
    return null as any;
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, options);
}

/**
 * Performance report generator
 */
export function generatePerformanceReport(): {
  summary: Record<string, number>;
  metrics: PerformanceMetric[];
  recommendations: string[];
} {
  const metrics = performanceMonitor.export();
  const recommendations: string[] = [];

  // Calculate averages
  const avgRender = performanceMonitor.getAverage('component_render');
  const avgAPI = performanceMonitor.getAverage('api_request');
  const p95Render = performanceMonitor.getPercentile('component_render', 95);
  const p95API = performanceMonitor.getPercentile('api_request', 95);

  // Generate recommendations
  if (avgRender > 16.67) {
    recommendations.push(
      `Average render time (${avgRender.toFixed(2)}ms) exceeds 60fps target. Consider using React.memo() or useMemo().`
    );
  }

  if (avgAPI > 1000) {
    recommendations.push(
      `Average API response time (${avgAPI.toFixed(2)}ms) is slow. Consider implementing caching or optimizing queries.`
    );
  }

  if (p95Render > 50) {
    recommendations.push(
      `95th percentile render time (${p95Render.toFixed(2)}ms) is high. Profile slow components.`
    );
  }

  return {
    summary: {
      avgRender,
      avgAPI,
      p95Render,
      p95API,
      totalMetrics: metrics.length,
    },
    metrics,
    recommendations,
  };
}
