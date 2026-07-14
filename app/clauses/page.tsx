import type { Metadata } from 'next';
import { JsonLd, breadcrumbSchema } from '@/components/JsonLd';
import ClausesPageClient from './ClausesPageClient';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Clause Library — 5,000+ Pre-Vetted Legal Clauses with Risk Ratings',
  description:
    'Browse 5,000+ professionally drafted legal clauses with risk ratings, usage counts, and alternative versions. Find safer alternatives and avoid dangerous contractual language.',
  alternates: { canonical: `${BASE_URL}/clauses` },
  openGraph: {
    title: 'Legal Clause Library — 5,000+ Vetted Clauses | BeforeYouSign',
    description:
      '5,000+ pre-vetted clauses with risk ratings and alternatives. Find safer contract language instantly.',
    url: `${BASE_URL}/clauses`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Clause Library | BeforeYouSign',
    description: '5,000+ pre-vetted clauses with risk ratings and safer alternatives.',
    images: ['/opengraph-image'],
  },
};

export default function ClausesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BASE_URL },
          { name: 'Clause Library', url: `${BASE_URL}/clauses` },
        ])}
      />
      <ClausesPageClient />
    </>
  );
}
