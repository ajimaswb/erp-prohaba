import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default async function WorkshopPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Workshop & Fabrikasi" subtitle="Order fabrikasi & pemotongan material" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><span style={{fontSize:48}}>🔧</span><h3>Modul Workshop</h3><p>Manajemen order fabrikasi, cutting list, dan status pengiriman. Fase 2.</p></div></div></div>
    </AppLayout>
  );
}
