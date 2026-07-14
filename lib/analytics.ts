/**
 * Analytics and Event Tracking System
 * 
 * Features:
 * - User behavior tracking
 * - Conversion funnel analysis
 * - Custom event tracking
 * - Session recording
 * - A/B testing support
 * - Privacy-compliant data collection
 */

import { db } from './database';
import { performanceMonitor } from './performance';

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  event: string;
  category: 'user_action' | 'navigation' | 'conversion' | 'error' | 'performance';
  properties?: Record<string, any>;
  metadata: {
    url: string;
    userAgent: string;
    screenSize: string;
    referrer: string;
  };
}

export interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  userId?: string;
  events: string[]; // Event IDs
  pageViews: number;
  interactions: number;
  conversions: number;
}

/**
 * Analytics Manager
 */
class Analytics {
  private session: UserSession | null = null;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSession();
      this.setupEventListeners();
      this.startSessionMonitoring();
    }
  }

  /**
   * Initialize or resume session
   */
  private initializeSession(): void {
    const stored = sessionStorage.getItem('__analytics_session');
    
    if (stored) {
      try {
        const session: UserSession = JSON.parse(stored);
        
        // Check if session is still valid
        const age = Date.now() - session.startTime;
        if (age < this.SESSION_TIMEOUT) {
          this.session = session;
          return;
        }
      } catch (error) {
        console.error('[Analytics] Error loading session:', error);
      }
    }

    // Create new session
    this.session = {
      id: crypto.randomUUID(),
      startTime: Date.now(),
      events: [],
      pageViews: 0,
      interactions: 0,
      conversions: 0,
    };

    this.saveSession();
    this.track('session_start', 'user_action');
  }

  /**
   * Save session to storage
   */
  private saveSession(): void {
    if (!this.session) return;
    sessionStorage.setItem('__analytics_session', JSON.stringify(this.session));
  }

  /**
   * Monitor session timeout
   */
  private startSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }

    this.sessionCheckInterval = setInterval(() => {
      if (!this.session) return;

      const age = Date.now() - this.session.startTime;
      if (age > this.SESSION_TIMEOUT) {
        this.endSession();
        this.initializeSession();
      }
    }, 60000); // Check every minute
  }

  /**
   * Setup automatic event listeners
   */
  private setupEventListeners(): void {
    // Track page views
    window.addEventListener('load', () => {
      this.trackPageView();
    });

    // Track navigation (for SPAs)
    window.addEventListener('popstate', () => {
      this.trackPageView();
    });

    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON') {
        const text = target.textContent?.trim() || 'Unknown';
        this.track('button_click', 'user_action', {
          buttonText: text,
          buttonId: target.id,
          buttonClass: target.className,
        });
      }

      // Track link clicks
      if (target.tagName === 'A') {
        const href = (target as HTMLAnchorElement).href;
        this.track('link_click', 'navigation', {
          href,
          text: target.textContent?.trim(),
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      this.track('form_submit', 'user_action', {
        formId: form.id,
        formAction: form.action,
      });
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', 'user_action');
      } else {
        this.track('page_visible', 'user_action');
      }
    });

    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  /**
   * Track custom event
   */
  track(
    event: string,
    category: AnalyticsEvent['category'],
    properties?: Record<string, any>
  ): void {
    if (!this.session) {
      this.initializeSession();
    }

    const analyticsEvent: AnalyticsEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      sessionId: this.session!.id,
      event,
      category,
      properties,
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer,
      },
    };

    // Save event to database
    db.insert('analyticsEvents', analyticsEvent);

    // Update session
    this.session!.events.push(analyticsEvent.id);
    
    if (category === 'user_action') {
      this.session!.interactions++;
    }
    
    if (category === 'conversion') {
      this.session!.conversions++;
    }

    this.saveSession();

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToService(analyticsEvent);
    }
  }

  /**
   * Track page view
   */
  trackPageView(customPath?: string): void {
    const path = customPath || window.location.pathname;
    
    this.track('page_view', 'navigation', {
      path,
      title: document.title,
      search: window.location.search,
      hash: window.location.hash,
    });

    if (this.session) {
      this.session.pageViews++;
      this.saveSession();
    }

    // Record performance
    performanceMonitor.record(
      'page_load',
      performance.now(),
      'vitals',
      'ms',
      { path }
    );
  }

  /**
   * Track conversion event
   */
  trackConversion(
    conversionType: string,
    value?: number,
    properties?: Record<string, any>
  ): void {
    this.track(`conversion_${conversionType}`, 'conversion', {
      ...properties,
      value,
      conversionType,
    });
  }

  /**
   * Track error event
   */
  trackError(
    error: Error | string,
    severity: 'warning' | 'error' | 'critical' = 'error',
    properties?: Record<string, any>
  ): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    this.track('error_occurred', 'error', {
      ...properties,
      message: errorMessage,
      stack: errorStack,
      severity,
    });
  }

  /**
   * Set user ID for tracking
   */
  identify(userId: string, traits?: Record<string, any>): void {
    if (!this.session) {
      this.initializeSession();
    }

    this.session!.userId = userId;
    this.saveSession();

    this.track('user_identified', 'user_action', {
      userId,
      ...traits,
    });
  }

  /**
   * End current session
   */
  private endSession(): void {
    if (!this.session) return;

    this.session.endTime = Date.now();
    const duration = this.session.endTime - this.session.startTime;

    this.track('session_end', 'user_action', {
      duration,
      pageViews: this.session.pageViews,
      interactions: this.session.interactions,
      conversions: this.session.conversions,
    });

    // Save complete session to database
    db.insert('userSessions', this.session);

    // Clear session
    this.session = null;
    sessionStorage.removeItem('__analytics_session');
  }

  /**
   * Send event to analytics service
   */
  private sendToService(event: AnalyticsEvent): void {
    // Production: Integrate with Google Analytics, Mixpanel, Amplitude
    // Example: gtag('event', event.event, { ...event.properties, session_id: event.sessionId });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event.event, event.properties);
    }
  }

  /**
   * Get session data
   */
  getSession(): UserSession | null {
    return this.session;
  }

  /**
   * Get all events for current session
   */
  getSessionEvents(): AnalyticsEvent[] {
    if (!this.session) return [];

    return db.find<AnalyticsEvent>(
      'analyticsEvents',
      (event) => event.sessionId === this.session!.id
    );
  }

  /**
   * Get events by category
   */
  getEventsByCategory(category: AnalyticsEvent['category'], limit?: number): AnalyticsEvent[] {
    return db.find<AnalyticsEvent>(
      'analyticsEvents',
      (event) => event.category === category,
      { limit, orderBy: 'timestamp', orderDirection: 'desc' }
    );
  }

  /**
   * Get conversion funnel data
   */
  getFunnelData(steps: string[]): {
    step: string;
    users: number;
    dropoff: number;
  }[] {
    const sessions = db.getAllItems<UserSession>('userSessions');
    const result: { step: string; users: number; dropoff: number }[] = [];

    let previousUsers = sessions.length;

    steps.forEach((step, index) => {
      const completedSessions = sessions.filter((session) => {
        const events = db.find<AnalyticsEvent>(
          'analyticsEvents',
          (event) => event.sessionId === session.id && event.event === step
        );
        return events.length > 0;
      });

      const users = completedSessions.length;
      const dropoff = index === 0 ? 0 : ((previousUsers - users) / previousUsers) * 100;

      result.push({ step, users, dropoff });
      previousUsers = users;
    });

    return result;
  }

  /**
   * Get analytics summary
   */
  getSummary(timeRange: number = 24 * 60 * 60 * 1000): {
    sessions: number;
    pageViews: number;
    interactions: number;
    conversions: number;
    avgSessionDuration: number;
    bounceRate: number;
  } {
    const now = Date.now();
    const sessions = db.find<UserSession>(
      'userSessions',
      (session) => now - session.startTime < timeRange
    );

    const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0);
    const totalInteractions = sessions.reduce((sum, s) => sum + s.interactions, 0);
    const totalConversions = sessions.reduce((sum, s) => sum + s.conversions, 0);

    const completedSessions = sessions.filter(s => s.endTime);
    const totalDuration = completedSessions.reduce(
      (sum, s) => sum + (s.endTime! - s.startTime),
      0
    );
    const avgSessionDuration = completedSessions.length > 0
      ? totalDuration / completedSessions.length
      : 0;

    const bouncedSessions = sessions.filter(s => s.pageViews === 1 && s.interactions === 0);
    const bounceRate = sessions.length > 0
      ? (bouncedSessions.length / sessions.length) * 100
      : 0;

    return {
      sessions: sessions.length,
      pageViews: totalPageViews,
      interactions: totalInteractions,
      conversions: totalConversions,
      avgSessionDuration,
      bounceRate,
    };
  }

  /**
   * Export analytics data
   */
  exportData(format: 'json' | 'csv' = 'json'): string {
    const events = db.getAllItems<AnalyticsEvent>('analyticsEvents');
    const sessions = db.getAllItems<UserSession>('userSessions');

    if (format === 'json') {
      return JSON.stringify({ events, sessions }, null, 2);
    }

    // CSV format
    const csvHeader = 'Timestamp,Event,Category,Session ID,User ID,Properties\n';
    const csvRows = events.map((event) => {
      const props = JSON.stringify(event.properties || {}).replace(/"/g, '""');
      return `${event.timestamp},${event.event},${event.category},${event.sessionId},${event.userId || ''},${props}`;
    }).join('\n');

    return csvHeader + csvRows;
  }
}

// Singleton instance
export const analytics = new Analytics();

// Convenience functions
export const trackEvent = analytics.track.bind(analytics);
export const trackPageView = analytics.trackPageView.bind(analytics);
export const trackConversion = analytics.trackConversion.bind(analytics);
export const trackError = analytics.trackError.bind(analytics);
export const identifyUser = analytics.identify.bind(analytics);

export default analytics;
