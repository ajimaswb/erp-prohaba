import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import PayrollClient from './PayrollClient';

export const metadata = { title: 'Payroll — ERP Prohaba Jaya Mandiri' };

export default async function PayrollPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Payroll & Penggajian" subtitle="Manajemen gaji karyawan dengan sistem anti-manipulasi" user={session.user}>
      <PayrollClient user={session.user} />
    </AppLayout>
  );
}
