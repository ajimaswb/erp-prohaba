import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default async function EmployeesPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Data Karyawan" subtitle="Manajemen SDM per proyek" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><span style={{fontSize:48}}>👷</span><h3>Modul Data Karyawan</h3><p>Database karyawan, penugasan per proyek, data BPJS & dokumen. Fase 1 (dalam pengembangan).</p></div></div></div>
    </AppLayout>
  );
}
