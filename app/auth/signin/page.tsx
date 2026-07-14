'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, Github, Chrome, AlertCircle } from 'lucide-react';
import { signInWithCredentials } from '@/lib/auth-utils';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signInWithCredentials(email, password);

      if (result.success) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError(result.error || 'Failed to sign in');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: 'github' | 'google') => {
    window.location.href = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Welcome Back</h1>
          <p className="text-stone-600">Sign in to access your contract analyses</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-stone-100 border-2 border-stone-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-stone-900">Sign In Failed</p>
              <p className="text-sm text-stone-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('github')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-stone-200 text-stone-900 font-medium hover:border-stone-900 transition-colors"
          >
            <Chrome className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-stone-50 text-stone-500">Or continue with email</span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-stone-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border-2 border-stone-200 focus:outline-none focus:border-stone-900 transition-colors bg-white"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-900 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-stone-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-10 py-3 border-2 border-stone-200 focus:outline-none focus:border-stone-900 transition-colors bg-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                ) : (
                  <Eye className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-stone-900 focus:ring-stone-900 border-stone-300 rounded"
              />
              <span className="ml-2 text-sm text-stone-600">Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-stone-900 hover:text-stone-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-stone-600">
          Don't have an account?{' '}
          <Link
            href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="text-stone-900 font-medium hover:text-stone-700"
          >
            Sign up for free
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-stone-100 border-2 border-stone-300">
          <p className="text-sm font-medium text-stone-900 mb-2">Demo Credentials</p>
          <p className="text-xs text-stone-700 font-mono">Email: test@example.com</p>
          <p className="text-xs text-stone-700 font-mono">Password: password123</p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center"><div className="w-8 h-8 border-b-2 border-stone-900 animate-spin"></div></div>}>
      <SignInContent />
    </Suspense>
  );
}
