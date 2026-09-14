import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

import { Building2 } from 'lucide-react';

export default async function ProjectsPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Manajemen Proyek" subtitle="7 proyek aktif" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><Building2 size={48} className="empty-state-icon" /><h3>Modul Proyek</h3><p>Segera tersedia. Data proyek ditampilkan di Dashboard.</p></div></div></div>
    </AppLayout>
  );
}
