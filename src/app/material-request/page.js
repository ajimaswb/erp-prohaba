import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default async function MaterialRequestPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Material Request" subtitle="Permintaan material dari site & workshop" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><span style={{fontSize:48}}>📦</span><h3>Modul Material Request</h3><p>Form MR dari lapangan dengan approval chain PJO → Logistik. Fase 2.</p></div></div></div>
    </AppLayout>
  );
}
