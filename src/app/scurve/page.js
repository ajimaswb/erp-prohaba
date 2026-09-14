import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import SCurveClient from './SCurveClient';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'S-Curve & Progress — ERP Prohaba Jaya Mandiri',
};

export default async function SCurvePage() {
  const session = await auth();
  if (!session) redirect('/login');

  // Fetch projects that are active
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const sCurveBaselines = await prisma.sCurveBaseline.findMany({
    orderBy: { week: 'asc' }
  });

  const boqItems = await prisma.bOQItem.findMany({
    include: {
      progress: {
        orderBy: { reportDate: 'asc' }
      }
    }
  });

  return (
    <AppLayout
      title="S-Curve & Progress Lapangan"
      subtitle="Monitoring progress fisik vs rencana semua proyek"
      user={session.user}
    >
      <SCurveClient 
        user={session.user} 
        projects={projects} 
        sCurveBaselines={sCurveBaselines} 
        boqItems={boqItems} 
      />
    </AppLayout>
  );
}
