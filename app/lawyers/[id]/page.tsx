import { lawyers } from '@/lib/lawyers-data';
import LawyerProfile from '@/components/LawyerProfile';
import { notFound } from 'next/navigation';

export default async function LawyerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lawyer = lawyers.find(l => l.id === id);

  if (!lawyer) {
    notFound();
  }

  return <LawyerProfile lawyer={lawyer} />;
}
