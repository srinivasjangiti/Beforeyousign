import type { Metadata } from 'next';
import { JsonLd, breadcrumbSchema } from '@/components/JsonLd';
import MultiLanguagePageClient from './MultiLanguagePageClient';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Multi-Language Contract Analysis — 50+ Languages Supported',
  description:
    'Analyze contracts written in Spanish, French, German, Chinese, Arabic, Portuguese, and 45+ other languages. AI detects language automatically and provides full legal analysis with optional English translation.',
  alternates: { canonical: `${BASE_URL}/multi-language` },
  openGraph: {
    title: 'Multi-Language Contract Analysis | BeforeYouSign',
    description:
      'Analyze contracts in 50+ languages. AI detects language automatically. Full legal analysis in any language.',
    url: `${BASE_URL}/multi-language`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Multi-Language Contract Analysis | BeforeYouSign',
    description: 'Analyze contracts in 50+ languages with full AI legal support.',
    images: ['/opengraph-image'],
  },
};

export default function MultiLanguagePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BASE_URL },
          { name: 'Multi-Language Analysis', url: `${BASE_URL}/multi-language` },
        ])}
      />
      <MultiLanguagePageClient />
    </>
  );
}
