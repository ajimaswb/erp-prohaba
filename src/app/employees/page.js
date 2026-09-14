import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

import { Users } from 'lucide-react';

export default async function EmployeesPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Data Karyawan" subtitle="Manajemen SDM per proyek" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><Users size={48} className="empty-state-icon" /><h3>Modul Data Karyawan</h3><p>Database karyawan, penugasan per proyek, data BPJS & dokumen. Fase 1 (dalam pengembangan).</p></div></div></div>
    </AppLayout>
  );
}
