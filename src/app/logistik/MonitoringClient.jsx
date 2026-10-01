'use client';

import { useState } from 'react';
import { Truck, Droplet, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

function computeAvgConsumption(logs) {
  const valid = logs.filter(l => l.meterValue && l.liters);
  if (valid.length < 2) return null;
  const sorted = [...valid].sort((a, b) => a.meterValue - b.meterValue);
  const totalLiters = sorted.reduce((sum, l) => sum + l.liters, 0);
  const meterRange = sorted[sorted.length - 1].meterValue - sorted[0].meterValue;
  if (meterRange <= 0) return null;
  return (totalLiters / meterRange * 100).toFixed(1);
}

function getMaintenanceStatus(log, currentMeter) {
  if (!log.nextServiceMeter && !log.nextServiceDate) return null;
  const today = new Date();
  let statusByMeter = null;
  let statusByDate = null;

  if (log.nextServiceMeter && currentMeter) {
    const remaining = log.nextServiceMeter - currentMeter;
    if (remaining <= 0) statusByMeter = 'overdue';
    else if (remaining <= 50) statusByMeter = 'warning';
    else statusByMeter = 'ok';
  }

  if (log.nextServiceDate) {
    const daysUntil = Math.ceil((new Date(log.nextServiceDate) - today) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) statusByDate = 'overdue';
    else if (daysUntil <= 14) statusByDate = 'warning';
    else statusByDate = 'ok';
  }

  if (statusByMeter === 'overdue' || statusByDate === 'overdue') return 'overdue';
  if (statusByMeter === 'warning' || statusByDate === 'warning') return 'warning';
  return 'ok';
}

export default function MonitoringClient({ vehicles, fuelLogs, maintenanceLogs }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || null);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const vehicleFuelLogs = fuelLogs.filter(l => l.vehicleId === selectedVehicleId);
  const vehicleMaintenanceLogs = maintenanceLogs.filter(l => l.vehicleId === selectedVehicleId);

  const allMeterReadings = [
    ...vehicleFuelLogs.filter(l => l.meterValue).map(l => ({ meter: l.meterValue, date: l.date })),
    ...vehicleMaintenanceLogs.filter(l => l.meterValue).map(l => ({ meter: l.meterValue, date: l.date }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentMeter = allMeterReadings[0]?.meter || null;

  const totalFuelCost = vehicleFuelLogs.reduce((sum, l) => sum + l.totalCost, 0);
  const totalLiters = vehicleFuelLogs.reduce((sum, l) => sum + l.liters, 0);
  const avgConsumption = computeAvgConsumption(vehicleFuelLogs);
  const recentFuelLogs = [...vehicleFuelLogs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const sparepartLogs = vehicleMaintenanceLogs
    .filter(l => l.nextServiceMeter || l.nextServiceDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatCurrency = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const STATUS_CONFIG = {
    overdue: { label: 'Lewat Jadwal', color: '#ef4444', bg: '#fef2f2', icon: AlertTriangle },
    warning: { label: 'Segera Ganti', color: '#f59e0b', bg: '#fffbeb', icon: Clock },
    ok: { label: 'Normal', color: '#10b981', bg: '#f0fdf4', icon: CheckCircle },
  };

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      {/* Vehicle Selector Panel */}
      <div style={{ width: '230px', flexShrink: 0 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Pilih Kendaraan</div>
          </div>
          <div style={{ padding: '8px' }}>
            {vehicles.length === 0 ? (
              <p style={{ padding: '16px', color: 'var(--gray-500)', fontSize: '13px', textAlign: 'center' }}>
                Belum ada kendaraan.
              </p>
            ) : (
              vehicles.map(v => {
                const vMaintLogs = maintenanceLogs.filter(l => l.vehicleId === v.id && (l.nextServiceMeter || l.nextServiceDate));
                const vMeter = fuelLogs.filter(l => l.vehicleId === v.id && l.meterValue)
                  .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.meterValue || null;
                const hasOverdue = vMaintLogs.some(l => getMaintenanceStatus(l, vMeter) === 'overdue');
                const hasWarning = vMaintLogs.some(l => getMaintenanceStatus(l, vMeter) === 'warning');

                return (
                  <button key={v.id} onClick={() => setSelectedVehicleId(v.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                    padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    marginBottom: '4px',
                    background: selectedVehicleId === v.id ? 'var(--navy-50)' : 'transparent',
                    color: selectedVehicleId === v.id ? 'var(--navy-700)' : 'var(--gray-700)',
                    fontWeight: selectedVehicleId === v.id ? 600 : 400,
                    textAlign: 'left', transition: 'all 0.2s',
                  }}>
                    <Truck size={16} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--gray-500)' }}>{v.code || v.plateNumber || '-'}</div>
                    </div>
                    {hasOverdue && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />}
                    {!hasOverdue && hasWarning && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {selectedVehicle ? (
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Vehicle Header */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={24} style={{ color: 'var(--navy-600)' }} />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gray-900)' }}>{selectedVehicle.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                    {selectedVehicle.type} · {selectedVehicle.plateNumber || 'No Pol: -'} · Kode: {selectedVehicle.code || '-'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>HM / Odometer Terakhir</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--navy-700)' }}>{currentMeter ? currentMeter.toLocaleString('id-ID') : '-'}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Pengisian</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--navy-700)' }}>{vehicleFuelLogs.length}x</div>
                </div>
              </div>
            </div>
          </div>

          {/* BBM Stats */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div className="card">
              <div className="card-body" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Droplet size={18} style={{ color: '#3b82f6' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--gray-500)' }}>Total BBM</span>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>{totalLiters.toLocaleString('id-ID')} L</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={18} style={{ color: '#f59e0b' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--gray-500)' }}>Total Biaya BBM</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{formatCurrency(totalFuelCost)}</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={18} style={{ color: '#10b981' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--gray-500)' }}>Rata-rata Konsumsi</span>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>{avgConsumption ? `${avgConsumption} L/100` : '-'}</div>
              </div>
            </div>
          </div>

          {/* Sparepart + Fuel History */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={16} /> Status Sparepart & Servis
                </div>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {sparepartLogs.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gray-400)' }}>
                    <Wrench size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ fontSize: '13px' }}>Belum ada data tracking sparepart.</p>
                    <p style={{ fontSize: '12px', marginTop: '4px' }}>Saat input servis, isi kolom "Target HM Berikutnya" atau "Jadwal Servis Berikutnya".</p>
                  </div>
                ) : (
                  sparepartLogs.map(log => {
                    const status = getMaintenanceStatus(log, currentMeter);
                    const config = STATUS_CONFIG[status] || STATUS_CONFIG.ok;
                    const Icon = config.icon;
                    const remaining = log.nextServiceMeter && currentMeter ? log.nextServiceMeter - currentMeter : null;
                    const daysUntil = log.nextServiceDate
                      ? Math.ceil((new Date(log.nextServiceDate) - new Date()) / (1000 * 60 * 60 * 24))
                      : null;
                    return (
                      <div key={log.id} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '14px 16px', borderBottom: '1px solid var(--gray-100)',
                        background: status === 'overdue' ? '#fef2f2' : status === 'warning' ? '#fffdf0' : 'transparent'
                      }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={16} style={{ color: config.color }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{log.partName || log.description}</div>
                          <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginTop: '2px' }}>Diganti: {formatDate(log.date)}</div>
                          <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {log.nextServiceMeter && (
                              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '100px', background: config.bg, color: config.color, fontWeight: 600 }}>
                                {remaining !== null ? (remaining <= 0 ? `Lewat ${Math.abs(remaining).toFixed(0)} HM/km` : `Sisa ${remaining.toFixed(0)} HM/km`) : `Target: ${log.nextServiceMeter}`}
                              </span>
                            )}
                            {log.nextServiceDate && (
                              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '100px', background: config.bg, color: config.color, fontWeight: 600 }}>
                                {daysUntil !== null ? (daysUntil < 0 ? `Lewat ${Math.abs(daysUntil)} hari` : `${daysUntil} hari lagi`) : formatDate(log.nextServiceDate)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: config.color, background: config.bg, padding: '2px 8px', borderRadius: '100px', flexShrink: 0 }}>
                          {config.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Droplet size={16} /> Riwayat BBM Terakhir
                </div>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {recentFuelLogs.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gray-400)' }}>
                    <Droplet size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ fontSize: '13px' }}>Belum ada riwayat BBM untuk kendaraan ini.</p>
                  </div>
                ) : (
                  recentFuelLogs.map(log => (
                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--gray-100)' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>
                          {log.liters} L &nbsp;
                          <span className="badge badge-gray" style={{ fontSize: '11px' }}>{log.fuelType}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginTop: '2px' }}>
                          {formatDate(log.date)} {log.operator ? `· ${log.operator}` : ''}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-700)' }}>{formatCurrency(log.totalCost)}</div>
                        {log.meterValue && <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{log.meterValue.toLocaleString('id-ID')} HM/km</div>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ flex: 1 }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Truck size={48} style={{ color: 'var(--gray-300)', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--gray-500)' }}>Pilih kendaraan di sebelah kiri untuk melihat monitoring.</p>
          </div>
        </div>
      )}
    </div>
  );
}
