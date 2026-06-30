import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default async function ProjectsPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Manajemen Proyek" subtitle="7 proyek aktif" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><span style={{fontSize:48}}>🏗️</span><h3>Modul Proyek</h3><p>Segera tersedia. Data proyek ditampilkan di Dashboard.</p></div></div></div>
    </AppLayout>
  );
}
