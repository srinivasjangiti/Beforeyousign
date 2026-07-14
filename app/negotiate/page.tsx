import type { Metadata } from 'next';
import AIContractNegotiationAssistant from '@/components/AIContractNegotiationAssistant';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'AI Contract Negotiation — Get Counter-Proposals Instantly',
  description:
    'Get AI-powered negotiation recommendations with clause-by-clause counter-proposals. Level the playing field against institutional legal teams with BeforeYouSign’s negotiation assistant.',
  alternates: { canonical: `${BASE_URL}/negotiate` },
  openGraph: {
    title: 'AI Contract Negotiation Assistant | BeforeYouSign',
    description:
      'Clause-by-clause negotiation recommendations, market benchmarks, and counter-proposals powered by AI. Free to use.',
    url: `${BASE_URL}/negotiate`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Contract Negotiation | BeforeYouSign',
    description: 'Get instant counter-proposals and negotiation tactics for any contract clause.',
    images: ['/opengraph-image'],
  },
};

export default function NegotiatePage() {
  return <AIContractNegotiationAssistant />;
}
