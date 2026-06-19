'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to security audit system (import would be added when integrated)
    if (typeof window !== 'undefined') {
      const errorLog = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        event: 'error_boundary_triggered',
        severity: 'error' as const,
        details: {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        },
      };

      // Store in database for analysis
      const existingLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 1000 logs
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000);
      }
      
      localStorage.setItem('securityLogs', JSON.stringify(existingLogs));
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, send to error tracking service (Sentry, DataDog, etc.)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service
      // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white border-2 border-stone-900 overflow-hidden">
            {/* Error Header */}
            <div className="bg-stone-100 border-b-2 border-stone-900 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-900 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-stone-900">Something Went Wrong</h1>
                  <p className="text-sm text-stone-600 mt-1">
                    We encountered an unexpected error
                  </p>
                </div>
              </div>
            </div>

            {/* Error Details */}
            <div className="px-8 py-6">
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <Bug className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-stone-900 mb-2">Error Message</h2>
                    <div className="bg-stone-100 border border-stone-300 p-4">
                      <code className="text-sm text-stone-800 font-mono break-all">
                        {this.state.error?.message || 'Unknown error'}
                      </code>
                    </div>
                  </div>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                  <details className="mt-4">
                    <summary className="text-sm font-medium text-stone-900 cursor-pointer hover:text-stone-700 mb-2">
                      Stack Trace (Development Only)
                    </summary>
                    <div className="bg-stone-100 border border-stone-300 p-4 max-h-64 overflow-auto">
                      <pre className="text-xs text-stone-800 font-mono whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                )}

                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-sm font-medium text-stone-900 cursor-pointer hover:text-stone-700 mb-2">
                      Component Stack (Development Only)
                    </summary>
                    <div className="bg-stone-100 border border-stone-300 p-4 max-h-64 overflow-auto">
                      <pre className="text-xs text-stone-800 font-mono whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={this.resetError}
                  className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-stone-900 text-stone-900 font-semibold hover:bg-stone-50 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </div>

              {/* Support Message */}
              <div className="mt-6 p-4 bg-stone-100 border border-stone-300">
                <h3 className="font-semibold text-stone-900 mb-2">What happened?</h3>
                <p className="text-sm text-stone-700 mb-3">
                  An unexpected error occurred while rendering this page. This has been automatically logged for investigation.
                </p>
                <h4 className="font-semibold text-stone-900 mb-2">What can you do?</h4>
                <ul className="text-sm text-stone-700 space-y-1 list-disc list-inside">
                  <li>Click "Try Again" to retry the operation</li>
                  <li>Click "Go Home" to return to the main page</li>
                  <li>If the error persists, try refreshing your browser</li>
                  <li>Clear your browser cache and cookies if needed</li>
                </ul>
              </div>

              {/* Support Contact */}
              <div className="mt-4 text-center text-sm text-stone-600">
                Need help?{' '}
                <a
                  href="mailto:support@beforeyousign.com"
                  className="text-stone-900 hover:text-stone-700 font-medium underline"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
