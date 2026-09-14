import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

import { Package } from 'lucide-react';

export default async function MaterialRequestPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Material Request" subtitle="Permintaan material dari site & workshop" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><Package size={48} className="empty-state-icon" /><h3>Modul Material Request</h3><p>Form MR dari lapangan dengan approval chain PJO → Logistik. Fase 2.</p></div></div></div>
    </AppLayout>
  );
}
