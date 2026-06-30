'use client';

import { useState } from 'react';

const EMPLOYEES = [
  { id: '1', no: 'EMP-001', name: 'Ahmad Fauzi', position: 'Site Supervisor', type: 'STAFF', project: 'PRJ-001', workDays: 26, overtime: 12, baseSalary: 8500000, allowances: 2000000, deductions: 850000, bpjs: 425000, netSalary: 9225000 },
  { id: '2', no: 'EMP-002', name: 'Budi Santoso', position: 'Operator Alat Berat', type: 'HARIAN', project: 'PRJ-001', workDays: 24, overtime: 8, baseSalary: 6000000, allowances: 1200000, deductions: 0, bpjs: 300000, netSalary: 6900000 },
  { id: '3', no: 'EMP-003', name: 'Candra Wijaya', position: 'Welder', type: 'HARIAN', project: 'PRJ-001', workDays: 25, overtime: 16, baseSalary: 5500000, allowances: 1100000, deductions: 0, bpjs: 275000, netSalary: 6325000 },
  { id: '4', no: 'EMP-004', name: 'Dedi Kurniawan', position: 'Helper', type: 'HARIAN', project: 'PRJ-001', workDays: 22, overtime: 0, baseSalary: 3500000, allowances: 700000, deductions: 0, bpjs: 175000, netSalary: 4025000 },
  { id: '5', no: 'EMP-005', name: 'Eko Prasetyo', position: 'Safety Officer', type: 'STAFF', project: 'PRJ-001', workDays: 26, overtime: 4, baseSalary: 7000000, allowances: 1500000, deductions: 700000, bpjs: 350000, netSalary: 7450000 },
  { id: '6', no: 'EMP-006', name: 'Fitri Handayani', position: 'Admin Site', type: 'STAFF', project: 'PRJ-001', workDays: 26, overtime: 0, baseSalary: 5000000, allowances: 800000, deductions: 500000, bpjs: 250000, netSalary: 5050000 },
];

const PAYROLL_LIST = [
  { id: '1', period: 'Jun 2024', project: 'PRJ-001', total: 387500000, employees: 45, status: 'HRD_APPROVED', submittedBy: 'Ratna (HRD)', date: '2024-06-28' },
  { id: '2', period: 'Jun 2024', project: 'PRJ-002', total: 215800000, employees: 32, status: 'DRAFT', submittedBy: '-', date: '-' },
  { id: '3', period: 'Jun 2024', project: 'PRJ-003', total: 156400000, employees: 28, status: 'FINANCE_APPROVED', submittedBy: 'Ratna (HRD)', date: '2024-06-27' },
  { id: '4', period: 'Mei 2024', project: 'PRJ-001', total: 382100000, employees: 45, status: 'PAID', submittedBy: 'Ratna (HRD)', date: '2024-05-29' },
  { id: '5', period: 'Mei 2024', project: 'PRJ-002', total: 209500000, employees: 30, status: 'PAID', submittedBy: 'Ratna (HRD)', date: '2024-05-28' },
];

const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
const formatIDRShort = (val) => {
  if (val >= 1e9) return `Rp ${(val / 1e9).toFixed(1)}M`;
  if (val >= 1e6) return `Rp ${(val / 1e6).toFixed(0)}jt`;
  return `Rp ${val.toLocaleString('id-ID')}`;
};

const STATUS_CONFIG = {
  DRAFT: { label: 'Draft', class: 'badge-gray' },
  SUBMITTED: { label: 'Diajukan', class: 'badge-info' },
  HRD_APPROVED: { label: '✓ HRD Approve', class: 'badge-warning' },
  FINANCE_APPROVED: { label: '✓ Finance Approve', class: 'badge-navy' },
  PAID: { label: '✅ Dibayar', class: 'badge-success' },
};

export default function PayrollClient({ user }) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const canApproveHRD = ['HRD', 'TOP_MANAGEMENT'].includes(user?.role);
  const canApproveFinance = ['FINANCE', 'TOP_MANAGEMENT'].includes(user?.role);

  const totalPayrollJun = PAYROLL_LIST.filter(p => p.period === 'Jun 2024').reduce((s, p) => s + p.total, 0);
  const pendingApproval = PAYROLL_LIST.filter(p => ['SUBMITTED', 'HRD_APPROVED'].includes(p.status)).length;

  return (
    <>
      {/* Anti-Fraud Notice */}
      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <div>
          <strong>Sistem Anti-Manipulasi Payroll:</strong> Absensi diinput Supervisor lapangan → diverifikasi HRD → kalkulasi otomatis → approve Finance → approve Top Management → baru bisa dibayar. Setiap perubahan dicatat dalam audit log.
        </div>
      </div>

      {/* KPI */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card navy">
          <div className="kpi-label">Total Payroll Jun 2024</div>
          <div className="kpi-value">{formatIDRShort(totalPayrollJun)}</div>
          <div className="kpi-trend flat">Semua proyek</div>
        </div>
        <div className="kpi-card yellow">
          <div className="kpi-label">Menunggu Approval</div>
          <div className="kpi-value">{pendingApproval}</div>
          <div className="kpi-trend flat">Payroll pending</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Sudah Dibayar</div>
          <div className="kpi-value">{PAYROLL_LIST.filter(p => p.status === 'PAID').length}</div>
          <div className="kpi-trend flat">Bulan ini</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">Anomali Terdeteksi</div>
          <div className="kpi-value">0</div>
          <div className="kpi-trend up">✅ Bersih</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          💳 Daftar Payroll
        </button>
        <button className={`tab ${activeTab === 'detail' ? 'active' : ''}`} onClick={() => setActiveTab('detail')}>
          👷 Detail Karyawan
        </button>
        <button className={`tab ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
          🗓️ Verifikasi Absensi
        </button>
      </div>

      {/* Payroll List */}
      {activeTab === 'list' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">💳 Daftar Payroll</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm">Export Excel</button>
              {['HRD', 'TOP_MANAGEMENT'].includes(user?.role) && (
                <button className="btn btn-primary btn-sm">
                  + Buat Payroll Baru
                </button>
              )}
            </div>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Proyek</th>
                  <th>Karyawan</th>
                  <th>Total Gaji</th>
                  <th>Diajukan Oleh</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {PAYROLL_LIST.map((p) => {
                  const sc = STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.period}</td>
                      <td><span className="project-code">{p.project}</span></td>
                      <td>{p.employees} orang</td>
                      <td style={{ fontWeight: 700, color: 'var(--navy-700)' }}>{formatIDRShort(p.total)}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>{p.submittedBy}</td>
                      <td><span className={`badge ${sc.class}`}>{sc.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setActiveTab('detail'); }}>
                            Detail
                          </button>
                          {p.status === 'SUBMITTED' && canApproveHRD && (
                            <button className="btn btn-primary btn-sm">Approve HRD</button>
                          )}
                          {p.status === 'HRD_APPROVED' && canApproveFinance && (
                            <button className="btn btn-orange btn-sm">Approve Finance</button>
                          )}
                          {p.status === 'FINANCE_APPROVED' && ['TOP_MANAGEMENT'].includes(user?.role) && (
                            <button className="btn btn-primary btn-sm">Approve & Bayar</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Detail */}
      {activeTab === 'detail' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">👷 Detail Gaji Karyawan — PRJ-001, Jun 2024</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm">Export Slip Gaji</button>
              <button className="btn btn-outline btn-sm">Export Excel</button>
            </div>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>No. Karyawan</th>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Tipe</th>
                  <th>Hari Kerja</th>
                  <th>Lembur (Jam)</th>
                  <th>Gaji Pokok</th>
                  <th>Tunjangan</th>
                  <th>Potongan</th>
                  <th>BPJS</th>
                  <th>Gaji Bersih</th>
                </tr>
              </thead>
              <tbody>
                {EMPLOYEES.map((e) => (
                  <tr key={e.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--navy-600)' }}>{e.no}</span></td>
                    <td style={{ fontWeight: 600 }}>{e.name}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--gray-600)' }}>{e.position}</td>
                    <td>
                      <span className={`badge ${e.type === 'STAFF' ? 'badge-navy' : 'badge-gray'}`}>{e.type}</span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{e.workDays}</td>
                    <td style={{ textAlign: 'center' }}>{e.overtime}</td>
                    <td>{formatIDR(e.baseSalary)}</td>
                    <td style={{ color: 'var(--green-600)' }}>+{formatIDR(e.allowances)}</td>
                    <td style={{ color: 'var(--red-600)' }}>-{formatIDR(e.deductions)}</td>
                    <td style={{ color: 'var(--orange-600)' }}>-{formatIDR(e.bpjs)}</td>
                    <td style={{ fontWeight: 800, color: 'var(--navy-800)' }}>{formatIDR(e.netSalary)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--navy-50)' }}>
                  <td colSpan={10} style={{ fontWeight: 800, color: 'var(--navy-800)', textAlign: 'right' }}>TOTAL</td>
                  <td style={{ fontWeight: 800, color: 'var(--navy-800)', fontSize: 14 }}>
                    {formatIDR(EMPLOYEES.reduce((s, e) => s + e.netSalary, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Verification */}
      {activeTab === 'attendance' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">🗓️ Verifikasi Absensi — PRJ-001, Juni 2024</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {canApproveHRD && (
                <button className="btn btn-primary btn-sm">✓ Verifikasi Semua</button>
              )}
            </div>
          </div>
          <div className="card-body">
            <div className="alert alert-warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div>
                <strong>Perhatian HRD:</strong> Absensi berikut diinput oleh Supervisor lapangan. Verifikasi sebelum payroll diproses. Jika ada anomali (jumlah hadir tiba-tiba meningkat, lembur berlebihan), hubungi PJO untuk klarifikasi.
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Karyawan</th>
                    <th>Input oleh</th>
                    <th>Tgl Input</th>
                    <th>Hari Hadir</th>
                    <th>Hari Izin</th>
                    <th>Hari Sakit</th>
                    <th>Lembur (Jam)</th>
                    <th>Status Verifikasi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.map((e) => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 600 }}>{e.name}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>Ahmad (Supervisor)</td>
                      <td style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>28 Jun 2024</td>
                      <td style={{ fontWeight: 700, color: 'var(--navy-700)', textAlign: 'center' }}>{e.workDays}</td>
                      <td style={{ textAlign: 'center' }}>0</td>
                      <td style={{ textAlign: 'center' }}>0</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: e.overtime > 10 ? 700 : 400, color: e.overtime > 10 ? 'var(--orange-600)' : 'inherit' }}>
                          {e.overtime}
                          {e.overtime > 10 && ' ⚠️'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-warning">Menunggu Verifikasi</span>
                      </td>
                      <td>
                        {canApproveHRD ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-primary btn-sm">✓ Setuju</button>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-500)' }}>✗ Revisi</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Hak akses HRD</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
