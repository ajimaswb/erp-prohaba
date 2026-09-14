'use client';

import { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown, LayoutDashboard, FileText, Activity 
} from 'lucide-react';

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
export default function SCurveClient({ user, projects, sCurveBaselines, boqItems }) {
  const [selectedProject, setSelectedProject] = useState(projects[0] || null);
  const [activeTab, setActiveTab] = useState('scurve');
  const [showInputForm, setShowInputForm] = useState(false);

  // Logic to process the database records into chart data
  const scurveData = useMemo(() => {
    if (!selectedProject) return [];
    
    // Get baselines for this project
    const projectBaselines = sCurveBaselines.filter(b => b.projectId === selectedProject.id);
    const projectBoqs = boqItems.filter(b => b.projectId === selectedProject.id);

    return projectBaselines.map(baseline => {
      // Calculate cumulative actual progress up to this week's date
      let cumulativeActual = 0;
      
      projectBoqs.forEach(boq => {
        // Find latest progress on or before baseline date
        const validProgress = boq.progress.filter(p => new Date(p.reportDate) <= new Date(baseline.date));
        if (validProgress.length > 0) {
          const latestProgress = validProgress[validProgress.length - 1]; // Already sorted asc
          cumulativeActual += (latestProgress.progressPct / 100) * boq.weight;
        }
      });

      return {
        minggu: `M${baseline.week}`,
        planned: baseline.planned,
        actual: parseFloat(cumulativeActual.toFixed(2)),
        financial: parseFloat((cumulativeActual * 0.95).toFixed(2)) // mock financial progress
      };
    });
  }, [selectedProject, sCurveBaselines, boqItems]);

  // Current BOQ State (latest progress)
  const currentBoqs = useMemo(() => {
    if (!selectedProject) return [];
    const projectBoqs = boqItems.filter(b => b.projectId === selectedProject.id);
    return projectBoqs.map(boq => {
      const latestProgress = boq.progress.length > 0 ? boq.progress[boq.progress.length - 1].progressPct : 0;
      return {
        ...boq,
        currentProgress: latestProgress,
        contribution: (latestProgress / 100) * boq.weight
      };
    });
  }, [selectedProject, boqItems]);

  if (!selectedProject) {
    return <div className="card p-6 text-center">Belum ada proyek aktif.</div>;
  }

  const latestData = scurveData.length > 0 ? scurveData[scurveData.length - 1] : null;
  const deviation = latestData ? (latestData.actual - latestData.planned).toFixed(1) : 0;
  const financialProgress = latestData?.financial || 0;

  const weightedProgress = currentBoqs.reduce((sum, item) => sum + item.contribution, 0);

  return (
    <>
      {/* Project Selector */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', flexShrink: 0 }}>Pilih Proyek:</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {projects.map(p => (
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
          <div style={{ fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedProject.name}
          </div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">Progress Rencana</div>
          <div className="kpi-value">{latestData?.planned ?? 0}%</div>
          <div className="kpi-trend flat">Baseline S-Curve</div>
        </div>
        <div className={`kpi-card ${parseFloat(deviation) >= 0 ? 'green' : 'red'}`}>
          <div className="kpi-label">Progress Aktual</div>
          <div className="kpi-value">{latestData?.actual ?? 0}%</div>
          <div className={`kpi-trend ${parseFloat(deviation) >= 0 ? 'up' : 'down'}`}>
            {parseFloat(deviation) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(deviation))}% deviasi
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
          <Activity size={16} className="inline-block mr-2" />
          Grafik S-Curve
        </button>
        <button className={`tab ${activeTab === 'boq' ? 'active' : ''}`} onClick={() => setActiveTab('boq')}>
          <LayoutDashboard size={16} className="inline-block mr-2" />
          Progress per Item BOQ
        </button>
        <button className={`tab ${activeTab === 'input' ? 'active' : ''}`} onClick={() => setActiveTab('input')}>
          <FileText size={16} className="inline-block mr-2" />
          Input Progress
        </button>
      </div>

      {/* S-Curve Chart */}
      {activeTab === 'scurve' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              S-Curve Progress — {selectedProject.code}: {selectedProject.name}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {parseFloat(deviation) < 0 && (
                <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={14} /> Behind {Math.abs(parseFloat(deviation))}%
                </span>
              )}
              {parseFloat(deviation) > 0 && (
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={14} /> Ahead {parseFloat(deviation)}%
                </span>
              )}
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: 400, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scurveData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-200)" />
                  <XAxis dataKey="minggu" axisLine={false} tickLine={false} tick={{ fill: 'var(--gray-500)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--gray-500)', fontSize: 12 }} dx={-10} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 20, fontSize: 13 }} />
                  
                  <Line 
                    type="monotone" 
                    dataKey="planned" 
                    name="Rencana (Baseline)" 
                    stroke="var(--gray-400)" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: 'var(--gray-400)', strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    name="Realisasi (Actual)" 
                    stroke={parseFloat(deviation) >= 0 ? 'var(--green-500)' : 'var(--red-500)'}
                    strokeWidth={4}
                    dot={{ r: 5, fill: parseFloat(deviation) >= 0 ? 'var(--green-500)' : 'var(--red-500)', strokeWidth: 0 }}
                    activeDot={{ r: 7, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="financial" 
                    name="Keuangan" 
                    stroke="var(--orange-400)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* BOQ Progress Table */}
      {activeTab === 'boq' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Rincian Progress Berdasarkan BOQ</div>
            <button className="btn btn-sm btn-outline">
              <FileText size={14} className="inline-block mr-2" />
              Download Laporan
            </button>
          </div>
          <div className="card-body p-0">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Kode</th>
                  <th>Uraian Pekerjaan</th>
                  <th>Satuan</th>
                  <th>Kuantitas</th>
                  <th>Bobot</th>
                  <th>Progress Fisik</th>
                  <th>Kontribusi</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentBoqs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">Belum ada BOQ untuk proyek ini.</td>
                  </tr>
                )}
                {currentBoqs.map((item) => {
                  const contribution = item.contribution.toFixed(2);
                  const status = item.currentProgress === 100 ? 'SELESAI' :
                    item.currentProgress === 0 ? 'BELUM MULAI' :
                    item.currentProgress < 50 ? 'BERJALAN' : 'MAYORITAS';
                  const statusClass = item.currentProgress === 100 ? 'badge-success' :
                    item.currentProgress === 0 ? 'badge-gray' :
                    item.currentProgress < 50 ? 'badge-warning' : 'badge-info';
                  return (
                    <tr key={item.code}>
                      <td><span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--navy-600)' }}>{item.code}</span></td>
                      <td style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{item.description}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>{item.unit}</td>
                      <td style={{ fontWeight: 600, fontSize: 13 }}>{item.quantity.toLocaleString('id-ID')}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--navy-700)' }}>{item.weight}%</div>
                      </td>
                      <td style={{ minWidth: 180 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div className="progress-bar-wrap">
                              <div
                                className={`progress-bar-fill ${item.currentProgress === 100 ? 'green' : item.currentProgress > 0 ? 'navy' : ''}`}
                                style={{ width: `${item.currentProgress}%`, background: item.currentProgress === 0 ? 'var(--gray-200)' : undefined }}
                              />
                            </div>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-900)', minWidth: 35, textAlign: 'right' }}>
                            {item.currentProgress}%
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
              {currentBoqs.length > 0 && (
                <tfoot>
                  <tr style={{ background: 'var(--navy-50)' }}>
                    <td colSpan={4} style={{ fontWeight: 700, color: 'var(--navy-800)', fontSize: 13 }}>TOTAL</td>
                    <td style={{ fontWeight: 800, color: 'var(--navy-800)' }}>
                      {currentBoqs.reduce((s, i) => s + i.weight, 0).toFixed(1)}%
                    </td>
                    <td colSpan={1}></td>
                    <td style={{ fontWeight: 800, color: 'var(--navy-800)' }}>
                      {weightedProgress.toFixed(2)}%
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Input Progress Tab */}
      {activeTab === 'input' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Input Progress Lapangan — {selectedProject.code}</div>
          </div>
          <div className="card-body">
            <div className="alert alert-info">
              <Activity size={16} style={{ flexShrink: 0 }} />
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
                  {currentBoqs.map((item) => (
                    <tr key={item.code}>
                      <td style={{ fontWeight: 700, color: 'var(--navy-600)', fontSize: 12 }}>{item.code}</td>
                      <td style={{ fontSize: 13, color: 'var(--gray-700)' }}>{item.description}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--gray-500)' }}>{item.currentProgress}%</span>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input"
                          defaultValue={item.currentProgress}
                          min="0" max="100" step="0.5"
                          style={{ width: 90 }}
                          disabled={item.currentProgress === 100}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Catatan..."
                          disabled={item.currentProgress === 100}
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
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
                  <FileText size={32} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--gray-600)' }}>Klik atau drag foto lapangan</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>JPG, PNG, PDF (maks. 10MB per file)</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline">Simpan Draft</button>
              <button className="btn btn-primary">
                <CheckCircle size={16} className="inline-block mr-2" />
                Submit Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
