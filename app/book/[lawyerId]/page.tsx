import { lawyers } from '@/lib/lawyers-data';
import BookingForm from '@/components/BookingForm';
import { notFound } from 'next/navigation';

export default function BookingPage({ params }: { params: { lawyerId: string } }) {
  const lawyer = lawyers.find(l => l.id === params.lawyerId);

  if (!lawyer) {
    notFound();
  }

  return <BookingForm lawyer={lawyer} />;
}
