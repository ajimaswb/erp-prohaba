import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import LogistikClient from './LogistikClient';
import AppLayout from '@/components/AppLayout';

export const metadata = {
  title: 'Logistik & Alat Berat - ERP Prohaba',
};

export default async function LogistikPage() {
  const session = await auth();
  
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const fuelLogs = await prisma.fuelLog.findMany({
    include: {
      vehicle: true,
      project: true,
      user: true,
    },
    orderBy: { date: 'desc' }
  });

  const maintenanceLogs = await prisma.maintenanceLog.findMany({
    include: {
      vehicle: true,
      project: true,
      user: true,
    },
    orderBy: { date: 'desc' }
  });

  const projects = await prisma.project.findMany({
    select: { id: true, name: true, code: true }
  });

  return (
    <AppLayout title="Kendaraan & Alat Berat" subtitle="Monitoring pemakaian BBM dan perawatan logistik." user={session?.user}>
      <LogistikClient 
        user={session?.user} 
        vehicles={vehicles} 
        fuelLogs={fuelLogs} 
        maintenanceLogs={maintenanceLogs}
        projects={projects}
      />
    </AppLayout>
  );
}
