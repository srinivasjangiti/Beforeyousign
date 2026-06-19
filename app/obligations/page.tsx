import type { Metadata } from 'next';
import { JsonLd, breadcrumbSchema } from '@/components/JsonLd';
import ObligationsPageClient from './ObligationsPageClient';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Obligation Tracker — Auto-Extract Contract Deadlines & Commitments',
  description:
    'AI automatically extracts every contractual obligation, deadline, and commitment from your contract. Track pending, completed, and overdue obligations — never miss a commitment again.',
  alternates: { canonical: `${BASE_URL}/obligations` },
  openGraph: {
    title: 'Contract Obligation Tracker | BeforeYouSign',
    description:
      'Auto-extract and track all contractual obligations with deadlines. AI-powered commitment management.',
    url: `${BASE_URL}/obligations`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contract Obligation Tracker | BeforeYouSign',
    description: 'Never miss a contract deadline. AI extracts all obligations automatically.',
    images: ['/opengraph-image'],
  },
};

export default function ObligationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BASE_URL },
          { name: 'Obligation Tracker', url: `${BASE_URL}/obligations` },
        ])}
      />
      <ObligationsPageClient />
    </>
  );
}
