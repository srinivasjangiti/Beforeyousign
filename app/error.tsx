'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-stone-100 border-2 border-stone-900 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-stone-900" />
          </div>
          <div className="h-1 w-32 bg-stone-900 mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">Something Went Wrong</h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-lg mx-auto mb-6">
            We encountered an unexpected error while processing your request. 
            This has been logged and we'll look into it.
          </p>
          
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="bg-stone-100 border-2 border-stone-900 p-4 text-left max-w-lg mx-auto mb-6">
              <p className="text-xs font-semibold text-stone-900 mb-2 uppercase tracking-wide">
                Development Error Details:
              </p>
              <p className="text-sm text-stone-800 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-stone-600 font-mono mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 border-2 border-stone-900 text-stone-900 font-medium hover:bg-stone-100 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Help Text */}
        <div className="border-t-2 border-stone-200 pt-8">
          <p className="text-sm text-stone-600 mb-2">
            If this problem persists, please contact our support team.
          </p>
          <p className="text-xs text-stone-400 mono">
            Error logged • Support notified
          </p>
        </div>
      </div>
    </div>
  );
}
