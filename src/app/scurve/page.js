import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import SCurveClient from './SCurveClient';

export const metadata = {
  title: 'S-Curve & Progress — ERP Prohaba Jaya Mandiri',
};

export default async function SCurvePage() {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <AppLayout
      title="S-Curve & Progress Lapangan"
      subtitle="Monitoring progress fisik vs rencana semua proyek"
      user={session.user}
    >
      <SCurveClient user={session.user} />
    </AppLayout>
  );
}
