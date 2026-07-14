'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContractAnalysis } from '@/lib/types';
import AnalysisResult from '@/components/AnalysisResult';
import { Loader2, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SharedAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const shareId = params.shareId as string;

  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    loadSharedAnalysis();
  }, [shareId]);

  const loadSharedAnalysis = async (pwd?: string) => {
    try {
      setLoading(true);
      setPasswordError('');

      const response = await fetch(`/api/share/${shareId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });

      const data = await response.json();

      if (!data.success) {
        if (data.passwordRequired) {
          setPasswordRequired(true);
          setLoading(false);
          return;
        }
        if (data.error === 'Invalid password') {
          setPasswordError('Incorrect password');
          setLoading(false);
          return;
        }
        throw new Error(data.error || 'Failed to load analysis');
      }

      setAnalysis(data.analysis);
      setPasswordRequired(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shared analysis');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadSharedAnalysis(password);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-stone-900 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading shared analysis...</p>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border-2 border-stone-900 p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-stone-900 rounded-full mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2 text-center">
            Password Protected
          </h1>
          <p className="text-stone-600 mb-6 text-center">
            This analysis is password protected. Please enter the password to view.
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border-2 border-stone-300 focus:border-stone-900 focus:outline-none mb-4"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-600 text-sm mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {passwordError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-3 font-medium hover:bg-stone-800 transition-colors"
            >
              Unlock Analysis
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border-2 border-stone-900 p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Analysis Not Found
          </h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b-2 border-stone-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Shared Contract Analysis</h1>
              <p className="text-sm text-stone-500 mt-1">View-only mode</p>
            </div>
            <Link
              href="/"
              className="px-6 py-2.5 text-sm font-medium text-stone-900 bg-white border border-stone-300 hover:border-stone-900 hover:bg-stone-50 transition-all"
            >
              Analyze Your Own Contract
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16">
        <AnalysisResult analysis={analysis} />
      </main>
    </div>
  );
}
