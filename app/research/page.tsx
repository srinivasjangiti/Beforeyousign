import type { Metadata } from 'next';
import { JsonLd, breadcrumbSchema } from '@/components/JsonLd';
import ResearchPageClient from './ResearchPageClient';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Research — Chain-of-Thought Reasoning in Large Language Models',
  description:
    'Original research on faithfulness, robustness, and generalization in chain-of-thought reasoning for high-stakes AI decision support. Empirical evaluation of frontier LLMs.',
  alternates: { canonical: `${BASE_URL}/research` },
  openGraph: {
    title: 'Research — BeforeYouSign',
    description:
      'Academic research on LLM chain-of-thought reasoning reliability for high-stakes decision support, including legal contract review, clinical triage, and financial analysis.',
    url: `${BASE_URL}/research`,
    type: 'article',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research — BeforeYouSign',
    description: 'Original research on LLM faithfulness, robustness, and generalization in chain-of-thought reasoning.',
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