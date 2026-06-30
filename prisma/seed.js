import { PrismaLibSql } from '@prisma/adapter-libsql';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

// Build the libsql URL for local file (handle spaces in path)
const rawPath = `${process.cwd()}/dev.db`;
const dbUrl = 'file://' + rawPath.split('/').map((p, i) => i > 0 ? encodeURIComponent(p) : p).join('/');

// PrismaLibSql takes {url, authToken} object directly
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database ERP Prohaba Jaya Mandiri...');
  console.log('DB URL:', dbUrl);

  // Clean existing data (ignore errors on first run)
  const tables = [
    'auditLog', 'payrollApproval', 'payrollItem', 'payroll',
    'attendance', 'employeeProject', 'employee', 'progressItem',
    'sCurveBaseline', 'bOQItem', 'document', 'mRItem', 'materialRequest',
    'pOItem', 'purchaseOrder', 'payment', 'invoice', 'vendor',
    'revenue', 'project', 'user',
  ];
  for (const table of tables) {
    try { await prisma[table].deleteMany(); } catch {}
  }

  // ─── Users ────────────────────────────────────────────────
  console.log('Creating users...');
  await Promise.all([
    prisma.user.create({ data: { name: 'Direktur Utama', email: 'admin@prohaba.co.id', password: await bcrypt.hash('admin123', 10), role: 'TOP_MANAGEMENT' } }),
    prisma.user.create({ data: { name: 'Ratna Dewi', email: 'hrd@prohaba.co.id', password: await bcrypt.hash('hrd123', 10), role: 'HRD' } }),
    prisma.user.create({ data: { name: 'Hendra Wijaya', email: 'pjo@prohaba.co.id', password: await bcrypt.hash('pjo123', 10), role: 'PJO' } }),
    prisma.user.create({ data: { name: 'Sari Indah', email: 'finance@prohaba.co.id', password: await bcrypt.hash('finance123', 10), role: 'FINANCE' } }),
    prisma.user.create({ data: { name: 'Budi Santoso', email: 'logistik@prohaba.co.id', password: await bcrypt.hash('logistik123', 10), role: 'LOGISTIK' } }),
    prisma.user.create({ data: { name: 'Ir. Andi Surya', email: 'engineering@prohaba.co.id', password: await bcrypt.hash('engineering123', 10), role: 'ENGINEERING' } }),
    prisma.user.create({ data: { name: 'Pak Warsito', email: 'workshop@prohaba.co.id', password: await bcrypt.hash('workshop123', 10), role: 'WORKSHOP' } }),
  ]);

  // ─── Projects ────────────────────────────────────────────
  console.log('Creating projects...');
  await Promise.all([
    prisma.project.create({ data: { code: 'PRJ-001', name: 'Pembangunan Jetty & Coal Handling Facility', client: 'PT. Adaro Energy Tbk', location: 'Tabalong, Kalimantan Selatan', contractValue: 28500000000, startDate: new Date('2024-01-15'), endDate: new Date('2024-12-31') } }),
    prisma.project.create({ data: { code: 'PRJ-002', name: 'Konstruksi Conveyor Belt System', client: 'PT. Berau Coal', location: 'Berau, Kalimantan Timur', contractValue: 15800000000, startDate: new Date('2024-03-01'), endDate: new Date('2024-10-31') } }),
    prisma.project.create({ data: { code: 'PRJ-003', name: 'Fabrikasi & Instalasi Steel Structure', client: 'PT. Kideco Jaya Agung', location: 'Paser, Kalimantan Timur', contractValue: 9200000000, startDate: new Date('2023-09-01'), endDate: new Date('2024-07-31') } }),
    prisma.project.create({ data: { code: 'PRJ-004', name: 'Piping & Mechanical Works Mining Plant', client: 'PT. Arutmin Indonesia', location: 'Kotabaru, Kalimantan Selatan', contractValue: 12400000000, startDate: new Date('2024-04-01'), endDate: new Date('2025-03-31') } }),
    prisma.project.create({ data: { code: 'PRJ-005', name: 'Gudang & Fasilitas Penunjang Tambang', client: 'PT. Multi Harapan Utama', location: 'Kutai Kartanegara, Kaltim', contractValue: 6800000000, startDate: new Date('2023-11-01'), endDate: new Date('2024-08-31') } }),
    prisma.project.create({ data: { code: 'PRJ-006', name: 'Workshop & Maintenance Facility', client: 'PT. Indominco Mandiri', location: 'Bontang, Kalimantan Timur', contractValue: 5100000000, startDate: new Date('2024-05-01'), endDate: new Date('2025-01-31') } }),
    prisma.project.create({ data: { code: 'PRJ-007', name: 'Rehabilitasi & Upgrade Fasilitas Produksi', client: 'PT. Trubaindo Coal Mining', location: 'Kutai Barat, Kalimantan Timur', contractValue: 3900000000, startDate: new Date('2024-02-15'), endDate: new Date('2024-11-30') } }),
  ]);

  // ─── Vendors ─────────────────────────────────────────────
  console.log('Creating vendors...');
  await prisma.vendor.createMany({
    data: [
      { code: 'VND-001', name: 'PT. Baja Nusantara', contact: 'Pak Rahmat', phone: '0821-1234-5678', email: 'sales@bajanusantara.co.id' },
      { code: 'VND-002', name: 'CV. Teknik Andalan', contact: 'Bu Sri', phone: '0812-9876-5432' },
      { code: 'VND-003', name: 'PT. Logam Prima', contact: 'Pak Joko', phone: '0878-1111-2222' },
    ],
  });

  console.log('\n✅ Seed selesai!');
  console.log('\n📋 Akun Demo:');
  console.log('  Top Management: admin@prohaba.co.id     / admin123');
  console.log('  HRD:            hrd@prohaba.co.id       / hrd123');
  console.log('  PJO:            pjo@prohaba.co.id       / pjo123');
  console.log('  Finance:        finance@prohaba.co.id   / finance123');
  console.log('  Logistik:       logistik@prohaba.co.id  / logistik123');
  console.log('  Engineering:    engineering@prohaba.co.id / engineering123');
  console.log('  Workshop:       workshop@prohaba.co.id  / workshop123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
