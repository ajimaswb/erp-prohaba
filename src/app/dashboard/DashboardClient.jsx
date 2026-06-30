'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────
const PROJECTS = [
  {
    id: '1', code: 'PRJ-001', name: 'Pembangunan Jetty & Coal Handling Facility',
    client: 'PT. Adaro Energy Tbk', location: 'Tabalong, Kalimantan Selatan',
    contractValue: 28500000000, progress: 67, planned: 72, status: 'ACTIVE',
    startDate: '2024-01-15', endDate: '2024-12-31', spent: 18200000000,
    variance: -5, // behind schedule
  },
  {
    id: '2', code: 'PRJ-002', name: 'Konstruksi Conveyor Belt System',
    client: 'PT. Berau Coal', location: 'Berau, Kalimantan Timur',
    contractValue: 15800000000, progress: 45, planned: 40, status: 'ACTIVE',
    startDate: '2024-03-01', endDate: '2024-10-31', spent: 7200000000,
    variance: 5, // ahead of schedule
  },
  {
    id: '3', code: 'PRJ-003', name: 'Fabrikasi & Instalasi Steel Structure',
    client: 'PT. Kideco Jaya Agung', location: 'Paser, Kalimantan Timur',
    contractValue: 9200000000, progress: 88, planned: 85, status: 'ACTIVE',
    startDate: '2023-09-01', endDate: '2024-07-31', spent: 8100000000,
    variance: 3,
  },
  {
    id: '4', code: 'PRJ-004', name: 'Piping & Mechanical Works Mining Plant',
    client: 'PT. Arutmin Indonesia', location: 'Kotabaru, Kalimantan Selatan',
    contractValue: 12400000000, progress: 28, planned: 30, status: 'ACTIVE',
    startDate: '2024-04-01', endDate: '2025-03-31', spent: 3500000000,
    variance: -2,
  },
  {
    id: '5', code: 'PRJ-005', name: 'Gudang & Fasilitas Penunjang Tambang',
    client: 'PT. Multi Harapan Utama', location: 'Kutai Kartanegara, Kaltim',
    contractValue: 6800000000, progress: 92, planned: 90, status: 'ACTIVE',
    startDate: '2023-11-01', endDate: '2024-08-31', spent: 6200000000,
    variance: 2,
  },
  {
    id: '6', code: 'PRJ-006', name: 'Workshop & Maintenance Facility',
    client: 'PT. Indominco Mandiri', location: 'Bontang, Kalimantan Timur',
    contractValue: 5100000000, progress: 15, planned: 18, status: 'ACTIVE',
    startDate: '2024-05-01', endDate: '2025-01-31', spent: 800000000,
    variance: -3,
  },
  {
    id: '7', code: 'PRJ-007', name: 'Rehabilitasi & Upgrade Fasilitas Produksi',
    client: 'PT. Trubaindo Coal Mining', location: 'Kutai Barat, Kalimantan Timur',
    contractValue: 3900000000, progress: 55, planned: 55, status: 'ACTIVE',
    startDate: '2024-02-15', endDate: '2024-11-30', spent: 2100000000,
    variance: 0,
  },
];

const MONTHLY_REVENUE = [
  { bulan: 'Jan', pendapatan: 8200, biaya: 6800, profit: 1400 },
  { bulan: 'Feb', pendapatan: 9500, biaya: 7900, profit: 1600 },
  { bulan: 'Mar', pendapatan: 11200, biaya: 9100, profit: 2100 },
  { bulan: 'Apr', pendapatan: 13800, biaya: 11200, profit: 2600 },
  { bulan: 'Mei', pendapatan: 15100, biaya: 12400, profit: 2700 },
  { bulan: 'Jun', pendapatan: 14200, biaya: 11800, profit: 2400 },
];

const ALERTS = [
  { id: 1, type: 'danger', title: 'Pembelian Site Mencurigakan', desc: 'PRJ-001: Pembelian baut & mur Rp 4.5jt (markup 34% dari referensi)', time: '2 jam lalu' },
  { id: 2, type: 'warning', title: 'Progress Behind Schedule', desc: 'PRJ-001: Deviasi -5% dari rencana. Perlu percepatan.', time: '4 jam lalu' },
  { id: 3, type: 'warning', title: 'Hutang Jatuh Tempo', desc: '3 invoice senilai Rp 1.2M jatuh tempo dalam 7 hari', time: '1 hari lalu' },
  { id: 4, type: 'info', title: 'Payroll Menunggu Persetujuan', desc: 'Payroll Jun 2024 PRJ-003 menunggu approval Finance', time: '2 hari lalu' },
];

const PENDING_APPROVALS = [
  { id: 1, type: 'MR', number: 'MR-2024-047', project: 'PRJ-001', requestedBy: 'Ahmad Fauzi', value: null, status: 'Menunggu PJO' },
  { id: 2, type: 'PO', number: 'PO-2024-089', project: 'PRJ-002', requestedBy: 'Logistik', value: 245000000, status: 'Menunggu Finance' },
  { id: 3, type: 'PAYROLL', number: 'PAY-JUN-003', project: 'PRJ-003', requestedBy: 'HRD', value: 387500000, status: 'Menunggu Finance' },
  { id: 4, type: 'PURCHASE', number: 'SP-2024-012', project: 'PRJ-006', requestedBy: 'Budi Santoso', value: 4500000, status: '⚠️ Harga Markup' },
];

// ─── Formatters ───────────────────────────────────────────────
const formatIDR = (val, short = false) => {
  if (short) {
    if (val >= 1e9) return `Rp ${(val / 1e9).toFixed(1)}M`;
    if (val >= 1e6) return `Rp ${(val / 1e6).toFixed(0)}jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

const formatBillions = (val) => `Rp ${(val / 1e9).toFixed(2)}M`;

// ─── Custom Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'white', border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-md)', padding: '10px 14px',
      boxShadow: 'var(--shadow-lg)', fontSize: 12.5,
    }}>
      <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ color: 'var(--gray-600)' }}>{p.name}: </span>
          <strong>Rp {p.value}jt</strong>
        </div>
      ))}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────
export default function DashboardClient({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  const totalContract = PROJECTS.reduce((s, p) => s + p.contractValue, 0);
  const totalSpent = PROJECTS.reduce((s, p) => s + p.spent, 0);
  const avgProgress = Math.round(PROJECTS.reduce((s, p) => s + p.progress, 0) / PROJECTS.length);
  const totalProfit = MONTHLY_REVENUE.reduce((s, m) => s + m.profit, 0);

  const getVarianceBadge = (v) => {
    if (v > 0) return <span className="badge badge-success">▲ {v}% Ahead</span>;
    if (v < 0) return <span className="badge badge-danger">▼ {Math.abs(v)}% Behind</span>;
    return <span className="badge badge-gray">On Track</span>;
  };

  const getAlertIcon = (type) => {
    if (type === 'danger') return '🔴';
    if (type === 'warning') return '🟡';
    return '🔵';
  };

  const getApprovalBadge = (type) => {
    const map = {
      MR: 'badge-navy', PO: 'badge-info', PAYROLL: 'badge-orange', PURCHASE: 'badge-flag',
    };
    return map[type] || 'badge-gray';
  };

  return (
    <>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--navy-700) 60%, var(--orange-600) 140%)',
        borderRadius: 'var(--radius-xl)', padding: '24px 28px', marginBottom: 24,
        color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(249,115,22,0.15)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
            Selamat datang, {user?.name?.split(' ')[0]}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 8 }}>
            PT. Prohaba Jaya Mandiri — ERP Dashboard
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', display: 'flex', gap: 20 }}>
            <span>🏗️ {PROJECTS.length} Proyek Aktif</span>
            <span>📊 Avg. Progress {avgProgress}%</span>
            <span>💼 Total Kontrak {formatBillions(totalContract)}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card navy">
          <div className="kpi-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div className="kpi-label">Total Nilai Kontrak</div>
          <div className="kpi-value">{formatIDR(totalContract, true)}</div>
          <div className="kpi-trend up">
            ▲ 7 proyek aktif
          </div>
        </div>

        <div className="kpi-card orange">
          <div className="kpi-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="kpi-label">Total Realisasi Biaya</div>
          <div className="kpi-value">{formatIDR(totalSpent, true)}</div>
          <div className="kpi-trend flat">
            {((totalSpent / totalContract) * 100).toFixed(1)}% dari kontrak
          </div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
            </svg>
          </div>
          <div className="kpi-label">Profit YTD (Estimasi)</div>
          <div className="kpi-value">Rp {totalProfit.toLocaleString()}jt</div>
          <div className="kpi-trend up">▲ 12.4% vs tahun lalu</div>
        </div>

        <div className="kpi-card blue">
          <div className="kpi-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div className="kpi-label">Avg. Progress Fisik</div>
          <div className="kpi-value">{avgProgress}%</div>
          <div className="kpi-trend flat">Rata-rata 7 proyek</div>
        </div>

        <div className="kpi-card red">
          <div className="kpi-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="kpi-label">Alert Aktif</div>
          <div className="kpi-value">{ALERTS.length}</div>
          <div className="kpi-trend down">1 markup terdeteksi</div>
        </div>

        <div className="kpi-card yellow">
          <div className="kpi-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div className="kpi-label">Approval Tertunda</div>
          <div className="kpi-value">{PENDING_APPROVALS.length}</div>
          <div className="kpi-trend flat">MR, PO, Payroll</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Revenue & Profit Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              📈 Pendapatan & Profit Bulanan
            </div>
            <span className="badge badge-success">YTD 2024</span>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <div className="chart-container" style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E4A8A" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1E4A8A" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}jt`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="#1E4A8A" strokeWidth={2} fill="url(#colorPend)" />
                  <Area type="monotone" dataKey="profit" name="Profit" stroke="#16A34A" strokeWidth={2} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Project Progress Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📊 Progress Fisik per Proyek</div>
            <span className="badge badge-info">Real-time</span>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <div className="chart-container" style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PROJECTS.map(p => ({
                    name: p.code,
                    Rencana: p.planned,
                    Aktual: p.progress,
                  }))}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 12.5 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Rencana" fill="#B3CFEC" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Aktual" fill="#1E4A8A" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Alert Panel */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔔 Alert & Notifikasi</div>
            <span className="badge badge-danger">{ALERTS.length} Aktif</span>
          </div>
          <div className="card-body" style={{ padding: '8px 0' }}>
            {ALERTS.map((alert) => (
              <div key={alert.id} style={{
                padding: '12px 20px',
                borderBottom: '1px solid var(--gray-100)',
                display: 'flex', gap: 12, alignItems: 'flex-start',
                transition: 'background var(--transition-fast)',
                cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 16 }}>{getAlertIcon(alert.type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-900)', marginBottom: 2 }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--gray-500)', lineHeight: 1.4 }}>{alert.desc}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', flexShrink: 0 }}>{alert.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⏳ Menunggu Persetujuan</div>
            <span className="badge badge-warning">{PENDING_APPROVALS.length} Pending</span>
          </div>
          <div className="card-body" style={{ padding: '8px 0' }}>
            {PENDING_APPROVALS.map((item) => (
              <div key={item.id} style={{
                padding: '12px 20px',
                borderBottom: '1px solid var(--gray-100)',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'background var(--transition-fast)',
                cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className={`badge ${getApprovalBadge(item.type)}`}>{item.type}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-900)' }}>{item.number}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{item.project} · {item.requestedBy}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {item.value && (
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--navy-700)' }}>
                      {formatIDR(item.value, true)}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: item.status.includes('⚠️') ? 'var(--red-600)' : 'var(--gray-400)' }}>
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🏗️ Status Semua Proyek</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-success">7 Aktif</span>
            <button className="btn btn-outline btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>
          </div>
        </div>
        <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Proyek</th>
                <th>Klien</th>
                <th>Nilai Kontrak</th>
                <th>Progress (Aktual/Rencana)</th>
                <th>Realisasi Biaya</th>
                <th>Status</th>
                <th>Deviasi</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p) => {
                const pct = ((p.spent / p.contractValue) * 100).toFixed(0);
                return (
                  <tr key={p.id} style={{ cursor: 'pointer' }}>
                    <td>
                      <span className="project-code">{p.code}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-900)', maxWidth: 260 }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--gray-500)' }}>📍 {p.location}</div>
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--gray-600)', maxWidth: 180 }}>
                      {p.client}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-900)' }}>
                        {formatIDR(p.contractValue, true)}
                      </div>
                    </td>
                    <td style={{ minWidth: 180 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                          Aktual <strong style={{ color: 'var(--navy-700)' }}>{p.progress}%</strong>
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Rencana {p.planned}%</span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div
                          className={`progress-bar-fill ${p.progress >= p.planned ? 'green' : 'orange'}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--gray-900)' }}>
                        {formatIDR(p.spent, true)}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--gray-400)' }}>{pct}% dari kontrak</div>
                    </td>
                    <td>
                      <span className="badge badge-success">AKTIF</span>
                    </td>
                    <td>
                      {getVarianceBadge(p.variance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
