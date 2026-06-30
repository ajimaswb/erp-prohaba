import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import FinanceClient from './FinanceClient';

export const metadata = { title: 'Keuangan & AP — ERP Prohaba Jaya Mandiri' };

export default async function FinancePage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Keuangan & Accounts Payable" subtitle="Monitoring hutang, invoice, dan profitabilitas real-time" user={session.user}>
      <FinanceClient user={session.user} />
    </AppLayout>
  );
}
