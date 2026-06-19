import type { Metadata } from 'next';
import NotFoundClient from './NotFoundClient';

// Metadata for the 404 page
export const metadata: Metadata = {
  title: 'Page Not Found | BeforeYouSign',
  description: 'The page you are looking for does not exist on BeforeYouSign.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
