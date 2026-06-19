import type { Metadata } from 'next';
import { JsonLd, analyzeHowToSchema, breadcrumbSchema } from '@/components/JsonLd';
import AnalyzePageClient from './AnalyzePageClient';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Analyze Your Contract Free — AI Contract Review in 30 Seconds',
  description:
    'Upload a PDF or paste your contract text. Our AI reviews every clause, flags hidden risks, identifies obligations, and gives negotiation recommendations — instantly and for free.',
  alternates: { canonical: `${BASE_URL}/analyze` },
  openGraph: {
    title: 'Free AI Contract Analysis — BeforeYouSign',
    description:
      'Upload any contract and receive instant AI-powered risk analysis, plain-language summaries, and strategic negotiation tips. No account required.',
    url: `${BASE_URL}/analyze`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Contract Analysis — BeforeYouSign',
    description: 'Instant contract risk analysis — free, no account needed.',
    images: ['/opengraph-image'],
  },
};

export default function AnalyzePage() {
  return (
    <>
      <JsonLd data={analyzeHowToSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BASE_URL },
          { name: 'Analyze Contract', url: `${BASE_URL}/analyze` },
        ])}
      />
      <AnalyzePageClient />
    </>
  );
}
