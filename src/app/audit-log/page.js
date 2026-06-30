import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default async function AuditLogPage() {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user.role !== 'TOP_MANAGEMENT') redirect('/dashboard');
  return (
    <AppLayout title="Audit Log" subtitle="Rekam jejak semua aktivitas sistem" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><span style={{fontSize:48}}>🔍</span><h3>Audit Log</h3><p>Riwayat lengkap semua perubahan data: siapa, apa, kapan. Anti-manipulasi. Fase 3.</p></div></div></div>
    </AppLayout>
  );
}
