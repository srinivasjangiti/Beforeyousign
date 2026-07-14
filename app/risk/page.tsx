import type { Metadata } from 'next';
import { breadcrumbSchema } from '@/components/JsonLd';
import { JsonLd } from '@/components/JsonLd';
import RiskPageClient from './RiskPageClient';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Contract Risk Predictor — ML Dispute Probability Analysis',
  description:
    'Predict the probability of contract disputes, breach likelihood, and litigation risk with 82–95% accuracy using machine learning. Paste your contract to get instant risk scores.',
  alternates: { canonical: `${BASE_URL}/risk` },
  openGraph: {
    title: 'Contract Risk Predictor | BeforeYouSign',
    description:
      'ML-powered dispute probability scoring. Know your litigation risk before you sign — with 82–95% accuracy.',
    url: `${BASE_URL}/risk`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contract Risk Predictor | BeforeYouSign',
    description: 'Predict dispute probability and breach likelihood with AI.',
    images: ['/opengraph-image'],
  },
};

export default function RiskPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BASE_URL },
          { name: 'Risk Predictor', url: `${BASE_URL}/risk` },
        ])}
      />
      <RiskPageClient />
    </>
  );
}
