import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

import { UserCog } from 'lucide-react';

export default async function UsersPage() {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user.role !== 'TOP_MANAGEMENT') redirect('/dashboard');
  return (
    <AppLayout title="Manajemen Pengguna" subtitle="Kelola akun dan hak akses sistem" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><UserCog size={48} className="empty-state-icon" /><h3>Modul Pengguna</h3><p>Tambah/edit user, atur role dan hak akses. Fase 1 (dalam pengembangan).</p></div></div></div>
    </AppLayout>
  );
}
