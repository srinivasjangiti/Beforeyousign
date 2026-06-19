/**
 * Client-side authentication utilities
 * Provides hooks and helpers for managing auth state
 */

'use client';

import { useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Session {
  user: User;
  expires: string;
}

/**
 * Client-side hook to get current session
 * For server components, use auth() from @/auth instead
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('[Session Error]', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { session, loading };
}

/**
 * Helper to check if user is authenticated
 */
export function useAuth() {
  const { session, loading } = useSession();
  
  return {
    user: session?.user || null,
    isAuthenticated: !!session,
    isLoading: loading,
  };
}

/**
 * Sign out helper
 */
export async function signOut() {
  try {
    await fetch('/api/auth/signout', {
      method: 'POST',
    });
    window.location.href = '/';
  } catch (error) {
    console.error('[Sign Out Error]', error);
  }
}

/**
 * Sign in with credentials
 */
export async function signInWithCredentials(email: string, password: string) {
  try {
    const res = await fetch('/api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to sign in');
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign in',
    };
  }
}

/**
 * Register new user
 */
export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || 'Failed to register');
    }

    return { success: true, user: json.user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register',
    };
  }
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(name?: string): string {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Protected route wrapper - redirects to sign in if not authenticated
 * Note: For server components, use auth() from @/auth instead
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/signin?callbackUrl=' + window.location.pathname;
    }
  }, [isLoading, isAuthenticated]);

  return { isAuthenticated, isLoading };
}
