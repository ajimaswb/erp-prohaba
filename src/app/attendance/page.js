import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default async function AttendancePage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Absensi Karyawan" subtitle="Input & verifikasi kehadiran harian" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><span style={{fontSize:48}}>🗓️</span><h3>Modul Absensi</h3><p>Input absensi oleh Supervisor → verifikasi HRD → feed ke payroll. Dalam pengembangan.</p></div></div></div>
    </AppLayout>
  );
}
