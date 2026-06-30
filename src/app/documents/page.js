import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default async function DocumentsPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Dokumen Engineering" subtitle="Distribusi gambar ke site & workshop" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><span style={{fontSize:48}}>📐</span><h3>Modul Dokumen Engineering</h3><p>Upload & distribusi blueprint ke Site dan Workshop. Fase 2.</p></div></div></div>
    </AppLayout>
  );
}
