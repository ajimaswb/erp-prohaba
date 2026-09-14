import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

import { Banknote } from 'lucide-react';

export default async function RevenuePage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Pendapatan" subtitle="Pencatatan termin & progress billing" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><Banknote size={48} className="empty-state-icon" /><h3>Modul Pendapatan</h3><p>Pencatatan termin, progress billing, DP dan release retensi per proyek. Fase 2.</p></div></div></div>
    </AppLayout>
  );
}
