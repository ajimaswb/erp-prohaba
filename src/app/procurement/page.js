import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default async function ProcurementPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Procurement & Purchase Order" subtitle="Manajemen PO dan vendor" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><span style={{fontSize:48}}>🛒</span><h3>Modul Procurement & PO</h3><p>Pembuatan PO, manajemen vendor, dan tracking pengiriman. Fase 2.</p></div></div></div>
    </AppLayout>
  );
}
