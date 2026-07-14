import type { Metadata } from 'next';
import LawyerMarketplace from '@/components/LawyerMarketplace';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Find a Lawyer — Legal Marketplace for Contract Review',
  description:
    'Connect with verified, pre-vetted lawyers for complex contract issues that need professional legal review. Get expert guidance on NDAs, employment contracts, commercial agreements, and more.',
  alternates: { canonical: `${BASE_URL}/lawyers` },
  openGraph: {
    title: 'Legal Marketplace — Find a Contract Lawyer | BeforeYouSign',
    description:
      'Connect with verified lawyers for professional contract review and legal advice. Transparent pricing, vetted professionals.',
    url: `${BASE_URL}/lawyers`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find a Contract Lawyer | BeforeYouSign',
    description: 'Connect with verified lawyers for complex contract matters.',
    images: ['/opengraph-image'],
  },
};


export default function LawyersPage() {
  return <LawyerMarketplace />;
}
