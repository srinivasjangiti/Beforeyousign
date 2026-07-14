'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-stone-200';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent',
    none: ''
  };

  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Preset skeleton components
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border-2 border-stone-200 p-6 space-y-4">
      <Skeleton variant="rectangular" height={48} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}

export function LawyerCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border-2 border-stone-200 p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={64} height={64} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="70%" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={100} height={24} />
        <Skeleton variant="rectangular" width={100} height={24} />
      </div>
      <Skeleton variant="rectangular" height={40} />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="border-b border-stone-200 py-4 flex items-center gap-4">
      <Skeleton variant="rectangular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" />
      </div>
      <Skeleton variant="rectangular" width={80} height={32} />
    </div>
  );
}

export function AnalysisResultSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border-2 border-stone-200 p-8">
        <Skeleton variant="text" width="30%" height={32} className="mb-4" />
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-stone-50 rounded-lg p-4">
              <Skeleton variant="text" width="50%" className="mb-2" />
              <Skeleton variant="rectangular" height={48} />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton variant="text" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="95%" />
          <Skeleton variant="text" width="85%" />
        </div>
      </div>
    </div>
  );
}
