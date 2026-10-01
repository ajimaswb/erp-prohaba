const fs = require('fs');

const pageJs = `import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import LogistikClient from './LogistikClient';

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
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Kendaraan & Alat Berat</h1>
        <p className="page-subtitle">Monitoring pemakaian BBM dan perawatan logistik.</p>
      </div>
      <LogistikClient 
        user={session?.user} 
        vehicles={vehicles} 
        fuelLogs={fuelLogs} 
        maintenanceLogs={maintenanceLogs}
        projects={projects}
      />
    </div>
  );
}
`;

fs.writeFileSync('src/app/logistik/page.js', pageJs);
console.log('page.js created');
