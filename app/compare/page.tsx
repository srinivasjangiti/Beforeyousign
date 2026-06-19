import type { Metadata } from 'next';
import CompareVersions from '@/components/CompareVersions';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Compare Contracts Side-by-Side | BeforeYouSign',
  description:
    'Compare two contracts or different versions side-by-side with AI-powered difference detection and risk ranking.',
  alternates: { canonical: `${BASE_URL}/compare` },
  openGraph: {
    title: 'Compare Contracts Side-by-Side | BeforeYouSign',
    description: 'Compare contracts with AI difference detection and risk ranking.',
    url: `${BASE_URL}/compare`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Contracts | BeforeYouSign',
    description: 'Compare contracts with AI difference detection.',
    images: ['/opengraph-image'],
  },
};

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <CompareVersions />
    </div>
  );
}
