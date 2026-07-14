import type { Metadata } from 'next';
import { JsonLd, breadcrumbSchema } from '@/components/JsonLd';
import ResearchPageClient from './ResearchPageClient';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Research — AI & Legal NLP Publications by BeforeYouSign',
  description:
    'Original research papers by the BeforeYouSign team: chain-of-thought reasoning faithfulness in LLMs, and lightweight semantic retrieval for contract risk benchmarking using LEDGAR.',
  alternates: { canonical: `${BASE_URL}/research` },
  openGraph: {
    title: 'Research — BeforeYouSign',
    description:
      'Academic research on LLM reasoning reliability and semantic retrieval for contract intelligence, including empirical evaluations on legal clause classification and CoT faithfulness.',
    url: `${BASE_URL}/research`,
    type: 'article',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research — BeforeYouSign',
    description: 'Original research on LLM faithfulness in CoT reasoning and lightweight semantic retrieval for legal contract risk benchmarking.',
    images: ['/opengraph-image'],
  },
};

export default function ResearchPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BASE_URL },
          { name: 'Research', url: `${BASE_URL}/research` },
        ])}
      />
      <ResearchPageClient />
    </>
  );
}