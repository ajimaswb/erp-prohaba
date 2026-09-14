'use client';
import { DollarSign, TrendingUp, AlertTriangle, FileText, CheckCircle, Clock, BookOpen, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

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
  OVERDUE: { label: '⚠️ Overdue',  class: 'badge-danger' },
};

export default function FinanceClient({ user, glAccounts = [], purchaseInvoices = [], profitData = [] }) {
  const [activeTab, setActiveTab] = useState('overview');

  const totalHutang = purchaseInvoices.reduce((s, i) => s + i.amount, 0);
  const overdueCount = purchaseInvoices.filter(i => i.status === 'OVERDUE').length;
  const totalProfit = profitData.reduce((s, p) => s + p.profit, 0);
  const avgMargin = profitData.length ? (profitData.reduce((s, p) => s + p.margin, 0) / profitData.length).toFixed(1) : 0;
  
  const kasBankBalance = glAccounts.filter(a => a.accountType === 'KAS_BANK').reduce((s, a) => s + a.balance, 0);

  // Group AP by Aging
  const agingData = [
    { label: '< 30 hari', amount: 0, count: 0, color: '#22C55E' },
    { label: '30-60 hari', amount: 0, count: 0, color: '#EAB308' },
    { label: '60-90 hari', amount: 0, count: 0, color: '#F97316' },
    { label: '> 90 hari', amount: 0, count: 0, color: '#EF4444' },
  ];
  
  const today = new Date();
  purchaseInvoices.forEach(inv => {
    if (inv.status === 'PAID') return;
    const due = new Date(inv.dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    let bucket = 0;
    if (diffDays < 0) bucket = 3; // overdue
    else if (diffDays <= 30) bucket = 0;
    else if (diffDays <= 60) bucket = 1;
    else if (diffDays <= 90) bucket = 2;
    else bucket = 3;

    agingData[bucket].amount += inv.amount;
    agingData[bucket].count += 1;
  });

  return (
    <>
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card green">
          <div className="kpi-label">Total Saldo Kas & Bank</div>
          <div className="kpi-value">{formatIDRShort(kasBankBalance)}</div>
          <div className="kpi-trend flat">Sesuai Buku Besar</div>
        </div>
        <div className="kpi-card navy">
          <div className="kpi-label">Account Payable (Hutang)</div>
          <div className="kpi-value">{formatIDRShort(totalHutang)}</div>
          <div className="kpi-trend flat">{purchaseInvoices.length} Faktur Aktif</div>
        </div>
        <div className="kpi-card orange">
          <div className="kpi-label">Est. Laba Rugi Berjalan</div>
          <div className="kpi-value">{formatIDRShort(totalProfit * 1000000)}</div>
          <div className="kpi-trend up">Avg. Margin {avgMargin}%</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">AP Overdue</div>
          <div className="kpi-value">{overdueCount}</div>
          <div className="kpi-trend down">Risiko Denda</div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><TrendingUp size={16}/> Profitabilitas Proyek</button>
        <button className={`tab ${activeTab === 'gl' ? 'active' : ''}`} onClick={() => setActiveTab('gl')}><BookOpen size={16}/> Buku Besar (GL)</button>
        <button className={`tab ${activeTab === 'ap' ? 'active' : ''}`} onClick={() => setActiveTab('ap')}><FileSpreadsheet size={16}/> Faktur Pembelian (AP)</button>
        <button className={`tab ${activeTab === 'aging' ? 'active' : ''}`} onClick={() => setActiveTab('aging')}><Clock size={16}/> Aging Schedule</button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid-2" style={{ gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Project Profitability Matching (jt Rp)</div>
            </div>
            <div className="card-body">
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="project" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}jt`} />
                    <Tooltip formatter={(v, n) => [n === 'margin' ? `${Number(v).toFixed(1)}%` : `Rp ${Number(v).toFixed(1)}jt`, n]} contentStyle={{ borderRadius: 10, fontSize: 12.5 }} />
                    <Bar dataKey="kontrak" name="Revenue" fill="#B3CFEC" radius={[3,3,0,0]} />
                    <Bar dataKey="biaya" name="Cost" fill="#F97316" radius={[3,3,0,0]} />
                    <Bar dataKey="profit" name="Net Profit" fill="#1E4A8A" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Margin Analisis per Proyek</div>
            </div>
            <div className="card-body">
              {profitData.map(p => (
                <div key={p.project} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.project}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{p.name}</div>
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

      {activeTab === 'gl' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Buku Besar (Chart of Accounts)</div>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>No. Akun</th>
                  <th>Nama Akun</th>
                  <th>Kategori</th>
                  <th>Mata Uang</th>
                  <th>Saldo Akhir</th>
                </tr>
              </thead>
              <tbody>
                {glAccounts.map((acc) => (
                  <tr key={acc.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--navy-600)' }}>{acc.accountNo}</td>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{acc.name}</td>
                    <td><span className="badge badge-gray">{acc.accountType}</span></td>
                    <td style={{ fontSize: 12 }}>{acc.currency}</td>
                    <td style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{formatIDR(acc.balance)}</td>
                  </tr>
                ))}
                {glAccounts.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: 20 }}>Buku besar belum dikonfigurasi.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ap' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Faktur Pembelian (Purchase Invoices)</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm">+ Catat Faktur Baru</button>
            </div>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>No. Faktur</th>
                  <th>Pemasok</th>
                  <th>Proyek</th>
                  <th>Total (DPP + PPN)</th>
                  <th>Jatuh Tempo</th>
                  <th>Sisa Umur</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseInvoices.map((inv) => {
                  const sc = STATUS_MAP[inv.status] || STATUS_MAP.UNPAID;
                  const due = new Date(inv.dueDate);
                  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={inv.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12.5, fontWeight: 700, color: 'var(--navy-600)' }}>{inv.invoiceNo}</td>
                      <td style={{ fontWeight: 500, fontSize: 13 }}>{inv.vendor?.name || '-'}</td>
                      <td><span className="project-code">{inv.project?.code || '-'}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{formatIDRShort(inv.totalAmount || inv.amount)}</td>
                      <td style={{ fontSize: 12.5, color: diff < 0 ? 'var(--red-600)' : 'var(--gray-600)', fontWeight: diff < 0 ? 700 : 400 }}>
                        {due.toLocaleDateString('id-ID')}
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: diff < 0 ? 'var(--red-600)' : diff <= 14 ? 'var(--yellow-500)' : 'var(--green-600)' }}>
                          {diff < 0 ? 'Overdue' : `${diff} hari`}
                        </span>
                      </td>
                      <td><span className={`badge ${sc.class}`}>{sc.label}</span></td>
                    </tr>
                  );
                })}
                {purchaseInvoices.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20 }}>Belum ada faktur pembelian.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'aging' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Aging Schedule (Umur Hutang)</div>
            </div>
            <div className="card-body">
              <div style={{ height: 260, marginBottom: 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={agingData.filter(d => d.amount > 0)} cx="50%" cy="50%" outerRadius={100} dataKey="amount" nameKey="label" label={({ label, percent }) => `${label} (${(percent * 100).toFixed(0)}%)`} labelLine={false} fontSize={11}>
                      {agingData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatIDRShort(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {agingData.map((a) => (
                <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: a.color }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</span>
                    <span className="badge badge-gray">{a.count} faktur</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: 13 }}>{formatIDRShort(a.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
