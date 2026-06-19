import { lawyers } from '@/lib/lawyers-data';
import LawyerProfile from '@/components/LawyerProfile';
import { notFound } from 'next/navigation';

export default function LawyerProfilePage({ params }: { params: { id: string } }) {
  const lawyer = lawyers.find(l => l.id === params.id);

  if (!lawyer) {
    notFound();
  }

  return <LawyerProfile lawyer={lawyer} />;
}
