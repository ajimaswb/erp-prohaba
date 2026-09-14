import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

import { Wrench } from 'lucide-react';

export default async function WorkshopPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Workshop & Fabrikasi" subtitle="Order fabrikasi & pemotongan material" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><Wrench size={48} className="empty-state-icon" /><h3>Modul Workshop</h3><p>Manajemen order fabrikasi, cutting list, dan status pengiriman. Fase 2.</p></div></div></div>
    </AppLayout>
  );
}
