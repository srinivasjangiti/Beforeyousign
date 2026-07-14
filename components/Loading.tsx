'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ text = 'Loading...', fullScreen = false, size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} text-stone-900 animate-spin`} />
        {text && <p className="text-sm text-stone-600 font-medium">{text}</p>}
      </div>
    </div>
  );
}

// Skeleton components for different content types
export function ContractCardSkeleton() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-stone-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-stone-100 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-20 bg-stone-200 rounded"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-stone-100 rounded"></div>
        <div className="h-3 bg-stone-100 rounded w-5/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-stone-200 rounded"></div>
        <div className="h-8 w-24 bg-stone-200 rounded"></div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-stone-200 rounded w-32"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-stone-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-stone-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-stone-200 rounded w-28"></div>
      </td>
    </tr>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 bg-stone-200 rounded-lg"></div>
        <div className="h-6 w-16 bg-stone-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-stone-200 rounded w-24"></div>
        <div className="h-4 bg-stone-100 rounded w-32"></div>
      </div>
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-stone-200 animate-pulse">
      <div className="w-10 h-10 bg-stone-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-stone-200 rounded w-3/4"></div>
        <div className="h-3 bg-stone-100 rounded w-1/2"></div>
      </div>
      <div className="h-8 w-20 bg-stone-200 rounded"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-stone-200 rounded w-48 mb-6"></div>
      <div className="h-64 bg-stone-100 rounded"></div>
    </div>
  );
}

export default Loading;
