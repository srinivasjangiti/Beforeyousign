import type { Metadata } from 'next';
import LegalLibrary from '@/components/LegalLibrary';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Legal Document Library — Contract Research & Reference',
  description:
    'Browse our legal document library for reference contracts, legal definitions, jurisdiction guides, and regulatory frameworks. Your research companion for understanding contract law.',
  alternates: { canonical: `${BASE_URL}/library` },
  openGraph: {
    title: 'Legal Document Library | BeforeYouSign',
    description:
      'Contract templates, legal definitions, and jurisdiction guides for research and reference.',
    url: `${BASE_URL}/library`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Document Library | BeforeYouSign',
    description: 'Legal research library for contracts, definitions, and jurisdiction guides.',
    images: ['/opengraph-image'],
  },
};

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <LegalLibrary />
    </div>
  );
}
