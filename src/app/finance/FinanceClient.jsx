'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const INVOICES = [
  { id: '1', invoiceNo: 'INV-2024-089', vendor: 'PT. Baja Nusantara', project: 'PRJ-001', amount: 485000000, dueDate: '2024-07-05', status: 'UNPAID', age: 15, type: 'Material' },
  { id: '2', invoiceNo: 'INV-2024-088', vendor: 'CV. Teknik Andalan', project: 'PRJ-002', amount: 215000000, dueDate: '2024-07-10', status: 'UNPAID', age: 10, type: 'Jasa' },
  { id: '3', invoiceNo: 'INV-2024-085', vendor: 'PT. Logam Prima', project: 'PRJ-003', amount: 325000000, dueDate: '2024-06-30', status: 'OVERDUE', age: 5, type: 'Material' },
  { id: '4', invoiceNo: 'INV-2024-080', vendor: 'PT. Konstruksi Mandiri', project: 'PRJ-001', amount: 750000000, dueDate: '2024-07-20', status: 'UNPAID', age: 25, type: 'Subkon' },
  { id: '5', invoiceNo: 'INV-2024-075', vendor: 'CV. Pipa Jaya', project: 'PRJ-004', amount: 128000000, dueDate: '2024-06-25', status: 'OVERDUE', age: 10, type: 'Material' },
  { id: '6', invoiceNo: 'INV-2024-070', vendor: 'PT. Baja Nusantara', project: 'PRJ-002', amount: 265000000, dueDate: '2024-07-15', status: 'PARTIAL', age: 5, type: 'Material' },
  { id: '7', invoiceNo: 'INV-2024-065', vendor: 'PT. Alat Berat Sejahtera', project: 'PRJ-005', amount: 480000000, dueDate: '2024-08-01', status: 'UNPAID', age: 40, type: 'Sewa' },
];

const PROFIT_DATA = [
  { project: 'PRJ-001', kontrak: 28500, biaya: 22400, profit: 6100, margin: 21.4 },
  { project: 'PRJ-002', kontrak: 15800, biaya: 11200, profit: 4600, margin: 29.1 },
  { project: 'PRJ-003', kontrak: 9200, biaya: 7800, profit: 1400, margin: 15.2 },
  { project: 'PRJ-004', kontrak: 12400, biaya: 9500, profit: 2900, margin: 23.4 },
  { project: 'PRJ-005', kontrak: 6800, biaya: 5900, profit: 900, margin: 13.2 },
  { project: 'PRJ-006', kontrak: 5100, biaya: 3200, profit: 1900, margin: 37.3 },
  { project: 'PRJ-007', kontrak: 3900, biaya: 2800, profit: 1100, margin: 28.2 },
];

const AGING = [
  { label: '< 30 hari', amount: 1450000000, count: 4, color: '#22C55E' },
  { label: '30-60 hari', amount: 750000000, count: 2, color: '#EAB308' },
  { label: '60-90 hari', amount: 453000000, count: 2, color: '#F97316' },
  { label: '> 90 hari', amount: 265000000, count: 1, color: '#EF4444' },
];

const formatIDR = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
const formatIDRShort = (v) => {
  if (v >= 1e9) return `Rp ${(v / 1e9).toFixed(1)}M`;
  if (v >= 1e6) return `Rp ${(v / 1e6).toFixed(0)}jt`;
  return `Rp ${v.toLocaleString('id-ID')}`;
};

const STATUS_MAP = {
  UNPAID:  { label: 'Belum Bayar', class: 'badge-warning' },
  PARTIAL: { label: 'Sebagian',    class: 'badge-info' },
  PAID:    { label: 'Lunas',       class: 'badge-success' },
  OVERDUE: { label: '⚠️ Lewat Jatuh Tempo', class: 'badge-danger' },
};

export default function FinanceClient({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  const totalHutang = INVOICES.reduce((s, i) => s + i.amount, 0);
  const overdueCount = INVOICES.filter(i => i.status === 'OVERDUE').length;
  const totalProfit = PROFIT_DATA.reduce((s, p) => s + p.profit, 0);
  const avgMargin = (PROFIT_DATA.reduce((s, p) => s + p.margin, 0) / PROFIT_DATA.length).toFixed(1);

  return (
    <>
      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card navy">
          <div className="kpi-label">Total Hutang Dagang</div>
          <div className="kpi-value">{formatIDRShort(totalHutang)}</div>
          <div className="kpi-trend flat">{INVOICES.length} invoice aktif</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">Overdue</div>
          <div className="kpi-value">{overdueCount}</div>
          <div className="kpi-trend down">Segera dibayar</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Est. Profit Semua Proyek</div>
          <div className="kpi-value">Rp {totalProfit}jt</div>
          <div className="kpi-trend up">▲ Sehat</div>
        </div>
        <div className="kpi-card orange">
          <div className="kpi-label">Avg. Margin Proyek</div>
          <div className="kpi-value">{avgMargin}%</div>
          <div className="kpi-trend up">Rata-rata 7 proyek</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📊 Overview Profit</button>
        <button className={`tab ${activeTab === 'ap' ? 'active' : ''}`} onClick={() => setActiveTab('ap')}>📋 Daftar Hutang (AP)</button>
        <button className={`tab ${activeTab === 'aging' ? 'active' : ''}`} onClick={() => setActiveTab('aging')}>⏰ Aging Schedule</button>
      </div>

      {/* Profit Overview */}
      {activeTab === 'overview' && (
        <div className="grid-2" style={{ gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">💰 Profit per Proyek (jt Rp)</div>
            </div>
            <div className="card-body">
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PROFIT_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="project" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}jt`} />
                    <Tooltip formatter={(v, n) => [n === 'margin' ? `${v}%` : `Rp ${v}jt`, n]} contentStyle={{ borderRadius: 10, fontSize: 12.5 }} />
                    <Bar dataKey="kontrak" name="Nilai Kontrak" fill="#B3CFEC" radius={[3,3,0,0]} />
                    <Bar dataKey="biaya" name="Total Biaya" fill="#F97316" radius={[3,3,0,0]} />
                    <Bar dataKey="profit" name="Profit" fill="#1E4A8A" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📊 Margin Profit per Proyek</div>
            </div>
            <div className="card-body">
              {PROFIT_DATA.map(p => (
                <div key={p.project} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-900)' }}>{p.project}</span>
                      <span style={{ fontSize: 12, color: 'var(--gray-500)', marginLeft: 8 }}>Profit: Rp {p.profit}jt</span>
                    </div>
                    <span style={{
                      fontWeight: 800, fontSize: 13,
                      color: p.margin > 25 ? 'var(--green-600)' : p.margin > 15 ? 'var(--navy-700)' : 'var(--orange-600)'
                    }}>
                      {p.margin}%
                    </span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div
                      className={`progress-bar-fill ${p.margin > 25 ? 'green' : p.margin > 15 ? 'navy' : 'orange'}`}
                      style={{ width: `${Math.min(p.margin * 2, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AP Invoice List */}
      {activeTab === 'ap' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 Daftar Hutang Dagang (Accounts Payable)</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm">Export</button>
              <button className="btn btn-primary btn-sm">+ Catat Invoice</button>
            </div>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>No. Invoice</th>
                  <th>Vendor</th>
                  <th>Proyek</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                  <th>Jatuh Tempo</th>
                  <th>Usia (Hari)</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => {
                  const sc = STATUS_MAP[inv.status];
                  return (
                    <tr key={inv.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12.5, fontWeight: 700, color: 'var(--navy-600)' }}>
                        {inv.invoiceNo}
                      </td>
                      <td style={{ fontWeight: 500, fontSize: 13 }}>{inv.vendor}</td>
                      <td><span className="project-code">{inv.project}</span></td>
                      <td><span className="badge badge-gray">{inv.type}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{formatIDRShort(inv.amount)}</td>
                      <td style={{
                        fontSize: 12.5,
                        color: inv.status === 'OVERDUE' ? 'var(--red-600)' : 'var(--gray-600)',
                        fontWeight: inv.status === 'OVERDUE' ? 700 : 400,
                      }}>
                        {inv.dueDate}
                      </td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: inv.age <= 14 ? 'var(--green-600)' : inv.age <= 30 ? 'var(--yellow-500)' : 'var(--red-600)'
                        }}>
                          {inv.age} hari tersisa
                        </span>
                      </td>
                      <td><span className={`badge ${sc.class}`}>{sc.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm">Detail</button>
                          {['FINANCE', 'TOP_MANAGEMENT'].includes(user?.role) && inv.status !== 'PAID' && (
                            <button className="btn btn-primary btn-sm">Bayar</button>
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

      {/* Aging Schedule */}
      {activeTab === 'aging' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">⏰ Aging Schedule Hutang</div>
            </div>
            <div className="card-body">
              <div style={{ height: 260, marginBottom: 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={AGING} cx="50%" cy="50%" outerRadius={100} dataKey="amount" nameKey="label" label={({ label, percent }) => `${label} (${(percent * 100).toFixed(0)}%)`} labelLine={false} fontSize={11}>
                      {AGING.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatIDRShort(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {AGING.map((a) => (
                <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: a.color }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</span>
                    <span className="badge badge-gray">{a.count} invoice</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: 13 }}>{formatIDRShort(a.amount)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 800, fontSize: 14, color: 'var(--navy-800)' }}>
                <span>TOTAL</span>
                <span>{formatIDRShort(AGING.reduce((s, a) => s + a.amount, 0))}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📊 Prioritas Pembayaran</div>
            </div>
            <div className="card-body">
              <div className="alert alert-danger" style={{ marginBottom: 16 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                2 invoice sudah lewat jatuh tempo. Segera proses pembayaran untuk menghindari denda.
              </div>
              {INVOICES.filter(i => i.status === 'OVERDUE' || (i.status === 'UNPAID' && i.age < 15)).slice(0, 5).map((inv) => (
                <div key={inv.id} style={{
                  padding: '12px 14px', marginBottom: 8,
                  background: inv.status === 'OVERDUE' ? 'var(--red-50)' : 'var(--orange-50)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${inv.status === 'OVERDUE' ? 'var(--red-100)' : 'var(--orange-100)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-900)' }}>{inv.vendor}</span>
                    <span style={{ fontWeight: 800, fontSize: 13, color: inv.status === 'OVERDUE' ? 'var(--red-600)' : 'var(--orange-600)' }}>
                      {formatIDRShort(inv.amount)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--gray-500)' }}>
                    <span>{inv.invoiceNo}</span>
                    <span>Jatuh tempo: {inv.dueDate}</span>
                    <span className={`badge ${STATUS_MAP[inv.status].class}`} style={{ fontSize: 10 }}>{STATUS_MAP[inv.status].label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
