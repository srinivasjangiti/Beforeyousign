import type { Metadata } from 'next';
import { JsonLd, breadcrumbSchema } from '@/components/JsonLd';
import BenchmarkPageClient from './BenchmarkPageClient';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Contract Market Benchmark — Compare Terms Against Real Contracts',
  description:
    'Compare your contract terms against thousands of real-world market agreements. Get percentile rankings and strategic recommendations to improve your negotiating position.',
  alternates: { canonical: `${BASE_URL}/benchmark` },
  openGraph: {
    title: 'Contract Market Benchmark | BeforeYouSign',
    description:
      'Compare your contract terms against real market data. Know your percentile ranking and where to negotiate.',
    url: `${BASE_URL}/benchmark`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contract Market Benchmark | BeforeYouSign',
    description: 'Compare your contract terms against thousands of real agreements.',
    images: ['/opengraph-image'],
  },
};

export default function BenchmarkPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BASE_URL },
          { name: 'Market Benchmark', url: `${BASE_URL}/benchmark` },
        ])}
      />
      <BenchmarkPageClient />
    </>
  );
}
