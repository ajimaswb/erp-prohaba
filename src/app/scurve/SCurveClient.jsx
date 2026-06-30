'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine, Area, AreaChart,
  ComposedChart, Bar, BarChart,
} from 'recharts';

// ─── Mock S-Curve Data ────────────────────────────────────────
const PROJECTS = [
  { id: '1', code: 'PRJ-001', name: 'Jetty & Coal Handling Facility', client: 'PT. Adaro Energy', contractValue: 28500000000 },
  { id: '2', code: 'PRJ-002', name: 'Conveyor Belt System', client: 'PT. Berau Coal', contractValue: 15800000000 },
  { id: '3', code: 'PRJ-003', name: 'Steel Structure', client: 'PT. Kideco Jaya', contractValue: 9200000000 },
  { id: '4', code: 'PRJ-004', name: 'Piping & Mechanical Works', client: 'PT. Arutmin', contractValue: 12400000000 },
  { id: '5', code: 'PRJ-005', name: 'Gudang & Fasilitas Tambang', client: 'PT. Multi Harapan', contractValue: 6800000000 },
  { id: '6', code: 'PRJ-006', name: 'Workshop & Maintenance', client: 'PT. Indominco', contractValue: 5100000000 },
  { id: '7', code: 'PRJ-007', name: 'Rehabilitasi Fasilitas', client: 'PT. Trubaindo', contractValue: 3900000000 },
];

// Generate S-curve data for a project
function generateSCurveData(projectId) {
  const datasets = {
    '1': [
      { minggu: 'M1', planned: 1.2, actual: 0.8, financial: 0.5 },
      { minggu: 'M2', planned: 3.5, actual: 2.9, financial: 2.1 },
      { minggu: 'M3', planned: 7.2, actual: 6.1, financial: 5.8 },
      { minggu: 'M4', planned: 12.0, actual: 10.5, financial: 9.2 },
      { minggu: 'M5', planned: 18.5, actual: 16.8, financial: 15.4 },
      { minggu: 'M6', planned: 25.8, actual: 23.2, financial: 21.8 },
      { minggu: 'M7', planned: 34.0, actual: 31.5, financial: 29.1 },
      { minggu: 'M8', planned: 43.5, actual: 40.2, financial: 37.8 },
      { minggu: 'M9', planned: 52.0, actual: 48.7, financial: 45.9 },
      { minggu: 'M10', planned: 60.5, actual: 55.1, financial: 52.3 },
      { minggu: 'M11', planned: 68.2, actual: 62.8, financial: 59.2 },
      { minggu: 'M12', planned: 72.0, actual: 67.0, financial: 63.8 },
    ],
    '2': [
      { minggu: 'M1', planned: 2.0, actual: 2.5, financial: 2.0 },
      { minggu: 'M2', planned: 5.5, actual: 6.2, financial: 5.1 },
      { minggu: 'M3', planned: 10.0, actual: 11.8, financial: 10.5 },
      { minggu: 'M4', planned: 18.0, actual: 20.1, financial: 18.9 },
      { minggu: 'M5', planned: 28.5, actual: 30.8, financial: 29.2 },
      { minggu: 'M6', planned: 38.0, actual: 40.5, financial: 38.8 },
      { minggu: 'M7', planned: 40.0, actual: 45.0, financial: 43.1 },
    ],
    '3': [
      { minggu: 'M1', planned: 3.0, actual: 3.2, financial: 2.8 },
      { minggu: 'M2', planned: 8.0, actual: 8.5, financial: 7.9 },
      { minggu: 'M3', planned: 18.0, actual: 18.8, financial: 17.2 },
      { minggu: 'M4', planned: 30.0, actual: 31.5, financial: 29.8 },
      { minggu: 'M5', planned: 45.0, actual: 46.8, financial: 44.9 },
      { minggu: 'M6', planned: 58.0, actual: 60.2, financial: 58.1 },
      { minggu: 'M7', planned: 70.0, actual: 72.5, financial: 70.8 },
      { minggu: 'M8', planned: 80.0, actual: 82.9, financial: 81.2 },
      { minggu: 'M9', planned: 85.0, actual: 88.1, financial: 86.5 },
    ],
  };
  return datasets[projectId] || datasets['1'];
}

const BOQ_ITEMS = [
  { code: '1.1', description: 'Pekerjaan Persiapan & Mobilisasi', unit: 'LS', qty: 1, weight: 5.2, progress: 100 },
  { code: '1.2', description: 'Pekerjaan Sipil — Pondasi', unit: 'M³', qty: 2850, weight: 18.5, progress: 75 },
  { code: '1.3', description: 'Pekerjaan Struktur Baja', unit: 'Ton', qty: 485, weight: 22.8, progress: 60 },
  { code: '1.4', description: 'Pekerjaan Mekanikal', unit: 'Set', qty: 12, weight: 25.4, progress: 45 },
  { code: '1.5', description: 'Pekerjaan Elektrikal & Instrumentasi', unit: 'LS', qty: 1, weight: 15.6, progress: 35 },
  { code: '1.6', description: 'Pekerjaan Piping', unit: 'M', qty: 3200, weight: 8.9, progress: 55 },
  { code: '1.7', description: 'Commissioning & Start-up', unit: 'LS', qty: 1, weight: 3.6, progress: 0 },
];

// ─── Custom Components ─────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'white', border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-md)', padding: '10px 14px',
      boxShadow: 'var(--shadow-lg)', fontSize: 12.5,
    }}>
      <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color }} />
          <span style={{ color: 'var(--gray-600)' }}>{p.name}:</span>
          <strong style={{ color: p.color }}>{p.value.toFixed(1)}%</strong>
        </div>
      ))}
      {payload.length >= 2 && (
        <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: 6, paddingTop: 6, fontSize: 12 }}>
          <span style={{ color: 'var(--gray-500)' }}>Deviasi: </span>
          <strong style={{ color: payload[1]?.value >= payload[0]?.value ? 'var(--green-600)' : 'var(--red-600)' }}>
            {payload[1] ? `${payload[1].value >= payload[0].value ? '+' : ''}${(payload[1].value - payload[0].value).toFixed(1)}%` : '—'}
          </strong>
        </div>
      )}
    </div>
  );
};

// ─── Main S-Curve Client ───────────────────────────────────────
export default function SCurveClient({ user }) {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [activeTab, setActiveTab] = useState('scurve');
  const [showInputForm, setShowInputForm] = useState(false);

  const scurveData = generateSCurveData(selectedProject.id);
  const latestData = scurveData[scurveData.length - 1];
  const deviation = latestData ? (latestData.actual - latestData.planned).toFixed(1) : 0;
  const financialProgress = latestData?.financial || 0;

  const weightedProgress = BOQ_ITEMS.reduce((sum, item) => {
    return sum + (item.weight * item.progress / 100);
  }, 0);

  return (
    <>
      {/* Project Selector */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', flexShrink: 0 }}>Pilih Proyek:</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PROJECTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`btn btn-sm ${selectedProject.id === p.id ? 'btn-primary' : 'btn-outline'}`}
                >
                  {p.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project KPI Summary */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card navy">
          <div className="kpi-label">Proyek</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-700)', lineHeight: 1.3, marginBottom: 4 }}>
            {selectedProject.code}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.4 }}>
            {selectedProject.name.substring(0, 35)}...
          </div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">Progress Rencana</div>
          <div className="kpi-value">{latestData?.planned}%</div>
          <div className="kpi-trend flat">Baseline S-Curve</div>
        </div>
        <div className={`kpi-card ${parseFloat(deviation) >= 0 ? 'green' : 'red'}`}>
          <div className="kpi-label">Progress Aktual</div>
          <div className="kpi-value">{latestData?.actual}%</div>
          <div className={`kpi-trend ${parseFloat(deviation) >= 0 ? 'up' : 'down'}`}>
            {parseFloat(deviation) >= 0 ? '▲' : '▼'} {Math.abs(deviation)}% deviasi
          </div>
        </div>
        <div className="kpi-card orange">
          <div className="kpi-label">Progress Keuangan</div>
          <div className="kpi-value">{financialProgress}%</div>
          <div className="kpi-trend flat">Invoice tertagih</div>
        </div>
        <div className="kpi-card yellow">
          <div className="kpi-label">Progress Bobot (BOQ)</div>
          <div className="kpi-value">{weightedProgress.toFixed(1)}%</div>
          <div className="kpi-trend flat">Weighted average</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'scurve' ? 'active' : ''}`} onClick={() => setActiveTab('scurve')}>
          📈 Grafik S-Curve
        </button>
        <button className={`tab ${activeTab === 'boq' ? 'active' : ''}`} onClick={() => setActiveTab('boq')}>
          📋 Progress per Item BOQ
        </button>
        <button className={`tab ${activeTab === 'input' ? 'active' : ''}`} onClick={() => setActiveTab('input')}>
          ✏️ Input Progress
        </button>
      </div>

      {/* S-Curve Chart */}
      {activeTab === 'scurve' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              📈 S-Curve Progress — {selectedProject.code}: {selectedProject.name}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {parseFloat(deviation) < 0 && (
                <span className="badge badge-danger">⚠️ Behind {Math.abs(deviation)}%</span>
              )}
              {parseFloat(deviation) > 0 && (
                <span className="badge badge-success">✅ Ahead {deviation}%</span>
              )}
              {deviation == 0 && (
                <span className="badge badge-gray">On Track</span>
              )}
              <button className="btn btn-outline btn-sm">Export PDF</button>
            </div>
          </div>
          <div className="card-body">
            {/* Legend */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { color: '#7AAAD9', label: 'Rencana (Planned)', dash: '6 3' },
                { color: '#1E4A8A', label: 'Aktual (Fisik)', dash: null },
                { color: '#F97316', label: 'Aktual (Keuangan)', dash: null },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--gray-600)' }}>
                  <svg width="24" height="12">
                    {l.dash
                      ? <line x1="0" y1="6" x2="24" y2="6" stroke={l.color} strokeWidth="2" strokeDasharray={l.dash}/>
                      : <line x1="0" y1="6" x2="24" y2="6" stroke={l.color} strokeWidth="2.5"/>
                    }
                  </svg>
                  <span style={{ fontWeight: 500 }}>{l.label}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={scurveData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis
                    dataKey="minggu"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                    label={{ value: 'Periode', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `${v}%`}
                    domain={[0, 100]}
                    label={{ value: 'Progres (%)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {/* Deviation fill area */}
                  <Area
                    type="monotone"
                    dataKey="planned"
                    fill="#EBF5FF"
                    stroke="none"
                    fillOpacity={0.5}
                    legendType="none"
                  />
                  {/* Planned line */}
                  <Line
                    type="monotone"
                    dataKey="planned"
                    name="Rencana"
                    stroke="#7AAAD9"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    dot={{ r: 3, fill: '#7AAAD9', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#7AAAD9', stroke: 'white', strokeWidth: 2 }}
                  />
                  {/* Actual physical line */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Aktual Fisik"
                    stroke="#1E4A8A"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#1E4A8A', strokeWidth: 0 }}
                    activeDot={{ r: 7, fill: '#1E4A8A', stroke: 'white', strokeWidth: 2 }}
                  />
                  {/* Financial line */}
                  <Line
                    type="monotone"
                    dataKey="financial"
                    name="Aktual Keuangan"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#F97316', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#F97316', stroke: 'white', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Analysis Summary */}
            <div style={{
              background: parseFloat(deviation) < 0 ? 'var(--red-50)' : parseFloat(deviation) > 0 ? 'var(--green-50)' : 'var(--gray-50)',
              border: `1px solid ${parseFloat(deviation) < 0 ? 'var(--red-100)' : parseFloat(deviation) > 0 ? 'var(--green-100)' : 'var(--gray-200)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px', marginTop: 16,
              display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4, color: 'var(--gray-900)' }}>
                  {parseFloat(deviation) < 0 ? '⚠️ Analisis: Behind Schedule' : parseFloat(deviation) > 0 ? '✅ Analisis: Ahead of Schedule' : '✅ Analisis: On Track'}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                  {parseFloat(deviation) < 0
                    ? `Proyek ${selectedProject.code} saat ini tertinggal ${Math.abs(deviation)}% dari rencana. Progress keuangan juga lebih rendah dari fisik, menunjukkan keterlambatan penagihan. Perlu percepatan segera dan review schedule.`
                    : parseFloat(deviation) > 0
                    ? `Proyek ${selectedProject.code} berjalan lebih cepat ${deviation}% dari rencana. Progress keuangan mengikuti progress fisik dengan baik.`
                    : `Proyek ${selectedProject.code} berjalan sesuai rencana.`
                  }
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: parseFloat(deviation) < 0 ? 'var(--red-600)' : 'var(--green-600)' }}>
                    {deviation > 0 ? '+' : ''}{deviation}%
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Deviasi Fisik</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--orange-600)' }}>
                    {(latestData?.financial - latestData?.actual).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Gap Fin-Fisik</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOQ Progress Tab */}
      {activeTab === 'boq' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 Progress per Item BOQ — {selectedProject.code}</div>
            <button className="btn btn-outline btn-sm">Export Excel</button>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Uraian Pekerjaan</th>
                  <th>Satuan</th>
                  <th>Volume</th>
                  <th>Bobot (%)</th>
                  <th>Progress (%)</th>
                  <th>Kontribusi</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {BOQ_ITEMS.map((item) => {
                  const contribution = (item.weight * item.progress / 100).toFixed(2);
                  const status = item.progress === 100 ? 'SELESAI' :
                    item.progress === 0 ? 'BELUM MULAI' :
                    item.progress < 50 ? 'BERJALAN' : 'MAYORITAS';
                  const statusClass = item.progress === 100 ? 'badge-success' :
                    item.progress === 0 ? 'badge-gray' :
                    item.progress < 50 ? 'badge-warning' : 'badge-info';
                  return (
                    <tr key={item.code}>
                      <td><span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--navy-600)' }}>{item.code}</span></td>
                      <td style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{item.description}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>{item.unit}</td>
                      <td style={{ fontWeight: 600, fontSize: 13 }}>{item.qty.toLocaleString('id-ID')}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--navy-700)' }}>{item.weight}%</div>
                      </td>
                      <td style={{ minWidth: 180 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div className="progress-bar-wrap">
                              <div
                                className={`progress-bar-fill ${item.progress === 100 ? 'green' : item.progress > 0 ? 'navy' : ''}`}
                                style={{ width: `${item.progress}%`, background: item.progress === 0 ? 'var(--gray-200)' : undefined }}
                              />
                            </div>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-900)', minWidth: 35, textAlign: 'right' }}>
                            {item.progress}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--navy-700)', fontSize: 13 }}>{contribution}%</span>
                      </td>
                      <td>
                        <span className={`badge ${statusClass}`}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--navy-50)' }}>
                  <td colSpan={4} style={{ fontWeight: 700, color: 'var(--navy-800)', fontSize: 13 }}>TOTAL</td>
                  <td style={{ fontWeight: 800, color: 'var(--navy-800)' }}>
                    {BOQ_ITEMS.reduce((s, i) => s + i.weight, 0).toFixed(1)}%
                  </td>
                  <td colSpan={1}></td>
                  <td style={{ fontWeight: 800, color: 'var(--navy-800)' }}>
                    {weightedProgress.toFixed(2)}%
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Input Progress Tab */}
      {activeTab === 'input' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">✏️ Input Progress Lapangan — {selectedProject.code}</div>
          </div>
          <div className="card-body">
            <div className="alert alert-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Input progress oleh PJO atau Supervisor lapangan. Data akan langsung memperbarui grafik S-Curve.
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">Tanggal Laporan</label>
                <input type="date" className="form-input" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label className="form-label required">Periode</label>
                <select className="form-input form-select">
                  <option>Mingguan</option>
                  <option>Bulanan</option>
                </select>
              </div>
            </div>

            <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', overflow: 'hidden', marginBottom: 20 }}>
              <table>
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Uraian Pekerjaan</th>
                    <th>Progress Lalu (%)</th>
                    <th>Progress Baru (%)</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {BOQ_ITEMS.map((item) => (
                    <tr key={item.code}>
                      <td style={{ fontWeight: 700, color: 'var(--navy-600)', fontSize: 12 }}>{item.code}</td>
                      <td style={{ fontSize: 13, color: 'var(--gray-700)' }}>{item.description}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--gray-500)' }}>{item.progress}%</span>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input"
                          defaultValue={item.progress}
                          min="0" max="100" step="0.5"
                          style={{ width: 90 }}
                          disabled={item.progress === 100}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Catatan..."
                          disabled={item.progress === 100}
                          style={{ minWidth: 200 }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Foto Dokumentasi</label>
              <div style={{
                border: '2px dashed var(--gray-300)', borderRadius: 'var(--radius-md)',
                padding: '24px', textAlign: 'center', color: 'var(--gray-400)',
                cursor: 'pointer', transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy-400)'; e.currentTarget.style.background = 'var(--navy-50)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-300)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--gray-600)' }}>Klik atau drag foto lapangan</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>JPG, PNG, PDF (maks. 10MB per file)</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline">Simpan Draft</button>
              <button className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Submit Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
