import type { Metadata } from 'next';
import TemplatesLibrary from '@/components/TemplatesLibrary';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Contract Templates — 50+ Professional Legal Templates',
  description:
    'Browse 50+ professional, lawyer-reviewed contract templates across all industries. SaaS agreements, employment contracts, NDAs, service agreements, real estate leases, and more.',
  alternates: { canonical: `${BASE_URL}/templates` },
  openGraph: {
    title: 'Contract Templates — 50+ Professional Legal Templates | BeforeYouSign',
    description:
      '50+ professional contract templates across 10 industries. Lawyer-reviewed, AI-verified, ready to customize.',
    url: `${BASE_URL}/templates`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contract Templates | BeforeYouSign',
    description: '50+ professional contract templates, lawyer-reviewed and AI-verified.',
    images: ['/opengraph-image'],
  },
};

export default function TemplatesPage() {
  return (
    <div className="templates-page min-h-screen bg-stone-50">
      <TemplatesLibrary />
    </div>
  );
}
