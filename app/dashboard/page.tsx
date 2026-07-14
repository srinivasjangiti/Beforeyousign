import type { Metadata } from 'next';
import UserDashboard from '@/components/UserDashboard';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'My Dashboard | BeforeYouSign',
  description:
    'Manage, track, and revisit all your analyzed contracts in one place. View your contract portfolio health and upcoming deadlines.',
  alternates: { canonical: `${BASE_URL}/dashboard` },
  openGraph: {
    title: 'My Dashboard | BeforeYouSign',
    description: 'Manage your analyzed contracts and upcoming deadlines.',
    url: `${BASE_URL}/dashboard`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'My Dashboard | BeforeYouSign',
    description: 'Manage your analyzed contracts and upcoming deadlines.',
  },
};

export default function DashboardPage() {
    return <UserDashboard />;
}
