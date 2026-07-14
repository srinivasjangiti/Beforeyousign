'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search, FileText, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Large 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-stone-900 mb-4 leading-none">404</h1>
          <div className="h-1 w-32 bg-stone-900 mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-stone-600 leading-relaxed max-w-lg mx-auto">
            The page you're looking for doesn't exist or may have been moved. 
            Like a missing clause in a contract, it's simply not there.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all rounded-lg group"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border-2 border-stone-300 text-stone-700 font-medium hover:border-stone-900 hover:text-stone-900 transition-all rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="border-t-2 border-stone-200 pt-12">
          <p className="text-sm text-stone-500 uppercase tracking-wide font-semibold mb-6">
            Popular Pages
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/analyze"
              className="p-4 bg-white border-2 border-stone-200 rounded-xl hover:border-stone-900 transition-all group"
            >
              <FileText className="w-6 h-6 text-stone-600 group-hover:text-stone-900 mx-auto mb-2" />
              <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                Analyze Contract
              </p>
            </Link>
            
            <Link
              href="/library"
              className="p-4 bg-white border-2 border-stone-200 rounded-xl hover:border-stone-900 transition-all group"
            >
              <Search className="w-6 h-6 text-stone-600 group-hover:text-stone-900 mx-auto mb-2" />
              <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                Legal Library
              </p>
            </Link>
            
            <Link
              href="/lawyers"
              className="p-4 bg-white border-2 border-stone-200 rounded-xl hover:border-stone-900 transition-all group"
            >
              <HelpCircle className="w-6 h-6 text-stone-600 group-hover:text-stone-900 mx-auto mb-2" />
              <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                Find Lawyers
              </p>
            </Link>
            
            <Link
              href="/contracts"
              className="p-4 bg-white border-2 border-stone-200 rounded-xl hover:border-stone-900 transition-all group"
            >
              <FileText className="w-6 h-6 text-stone-600 group-hover:text-stone-900 mx-auto mb-2" />
              <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                My Contracts
              </p>
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-12">
          <p className="text-xs text-stone-400 mono">
            Error Code: 404 • Page Not Found
          </p>
        </div>
      </div>
    </div>
  );
}
