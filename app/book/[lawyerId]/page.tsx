import { lawyers } from '@/lib/lawyers-data';
import BookingForm from '@/components/BookingForm';
import { notFound } from 'next/navigation';

export default async function BookingPage({ params }: { params: Promise<{ lawyerId: string }> }) {
  const { lawyerId } = await params;
  const lawyer = lawyers.find(l => l.id === lawyerId);

  if (!lawyer) {
    notFound();
  }

  return <BookingForm lawyer={lawyer} />;
}
