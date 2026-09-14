import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AppLayout from '@/components/AppLayout';
import MaterialRequestClient from './MaterialRequestClient';

export default async function MaterialRequestPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const requests = await prisma.materialRequest.findMany({
    include: {
      project: true,
      requester: true,
      items: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  const projects = await prisma.project.findMany({
    orderBy: { code: 'asc' }
  });

  return (
    <AppLayout title="Material Request" subtitle="Permintaan material & alat dari Site ke Pusat" user={session.user}>
      <MaterialRequestClient requests={requests} projects={projects} user={session.user} />
    </AppLayout>
  );
}