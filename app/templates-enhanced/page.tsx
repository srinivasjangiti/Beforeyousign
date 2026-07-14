'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TemplatesEnhancedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main templates page - no duplicate/mock data
    router.replace('/templates');
  }, [router]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-stone-600">Redirecting to templates...</p>
      </div>
    </div>
  );
}
