import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default async function SitePurchasePage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <AppLayout title="Pembelian Site" subtitle="Kontrol pembelian lapangan — anti markup" user={session.user}>
      <div className="card"><div className="card-body"><div className="empty-state"><span style={{fontSize:48}}>🛍️</span><h3>Modul Site Purchase Control</h3><p>Pencatatan pembelian di site dengan benchmark harga otomatis. Harga &gt;10% dari referensi otomatis diflag. Fase 2.</p></div></div></div>
    </AppLayout>
  );
}
