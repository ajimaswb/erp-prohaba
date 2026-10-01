'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Droplet, Wrench, Plus, History, Info, X } from 'lucide-react';
import { useDialog } from '@/components/DialogProvider';

export default function LogistikClient({ user, vehicles, fuelLogs, maintenanceLogs, projects }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('fuel');
  
  // Add Vehicle State
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vCode, setVCode] = useState('');
  const [vName, setVName] = useState('');
  const [vType, setVType] = useState('KENDARAAN');
  const [vPlate, setVPlate] = useState('');
  
  // Fuel Log State
  const [vehicleId, setVehicleId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [fuelType, setFuelType] = useState('SOLAR');
  const [liters, setLiters] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [meterValue, setMeterValue] = useState('');
  const [operator, setOperator] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useDialog();

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!vName || !vType) {
      await showAlert('Nama Alat dan Tipe wajib diisi.', 'Peringatan');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/logistik/vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: vCode, name: vName, type: vType, plateNumber: vPlate, status: 'ACTIVE' })
      });
      if (!res.ok) throw new Error('Gagal menyimpan kendaraan');
      await showAlert('Kendaraan berhasil ditambahkan!', 'Sukses');
      setIsVehicleModalOpen(false);
      setVCode('');
      setVName('');
      setVPlate('');
      router.refresh();
    } catch (err) {
      await showAlert(err.message, 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleId || !fuelType || !liters || !totalCost) {
      await showAlert('Lengkapi data wajib (Kendaraan, Jenis BBM, Liter, Biaya)', 'Peringatan');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/logistik/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          projectId: projectId || null,
          fuelType,
          liters: parseFloat(liters),
          totalCost: parseFloat(totalCost),
          meterValue: meterValue ? parseFloat(meterValue) : null,
          operator
        })
      });

      if (!res.ok) throw new Error('Gagal menyimpan log BBM');

      await showAlert('Log BBM berhasil ditambahkan!', 'Sukses');
      
      // Reset
      setVehicleId('');
      setProjectId('');
      setLiters('');
      setTotalCost('');
      setMeterValue('');
      setOperator('');
      router.refresh();
      
    } catch (err) {
      await showAlert(err.message, 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <>
      <div className="tabs">
        <button className={`tab ${activeTab === 'fuel' ? 'active' : ''}`} onClick={() => setActiveTab('fuel')}>
          <Droplet size={16} className="inline-block mr-2" />
          Penggunaan BBM
        </button>
        <button className={`tab ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>
          <Wrench size={16} className="inline-block mr-2" />
          Perawatan & Servis
        </button>
        <button className={`tab ${activeTab === 'vehicles' ? 'active' : ''}`} onClick={() => setActiveTab('vehicles')}>
          <Truck size={16} className="inline-block mr-2" />
          Data Alat Berat
        </button>
      </div>

      {activeTab === 'fuel' && (
        <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Form Input BBM */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Input Pemakaian BBM</div>
            </div>
            <div className="card-body">
              <form onSubmit={handleFuelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label required">Kendaraan / Alat Berat</label>
                  <select className="form-input form-select" value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
                    <option value="">-- Pilih Kendaraan --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.code || v.plateNumber})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Proyek (Opsional)</label>
                  <select className="form-input form-select" value={projectId} onChange={e => setProjectId(e.target.value)}>
                    <option value="">-- Kantor Pusat / Gudang --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label required">Jenis BBM</label>
                    <select className="form-input form-select" value={fuelType} onChange={e => setFuelType(e.target.value)}>
                      <option value="SOLAR">Solar</option>
                      <option value="DEXLITE">Dexlite</option>
                      <option value="PERTAMAX">Pertamax</option>
                      <option value="PERTALITE">Pertalite</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Jumlah (Liter)</label>
                    <input type="number" className="form-input" value={liters} onChange={e => setLiters(e.target.value)} placeholder="100" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label required">Total Biaya (Rp)</label>
                  <input type="number" className="form-input" value={totalCost} onChange={e => setTotalCost(e.target.value)} placeholder="Rp..." />
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">HM / Odometer</label>
                    <input type="number" className="form-input" value={meterValue} onChange={e => setMeterValue(e.target.value)} placeholder="Angka km/jam" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Operator / Supir</label>
                    <input type="text" className="form-input" value={operator} onChange={e => setOperator(e.target.value)} placeholder="Nama..." />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ marginTop: '8px' }}>
                  <Droplet size={16} className="inline-block mr-2" />
                  Simpan Log BBM
                </button>
              </form>
            </div>
          </div>

          {/* Tabel History BBM */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Riwayat Pemakaian BBM Terakhir</div>
            </div>
            <div className="card-body p-0">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Kendaraan</th>
                    <th>Proyek</th>
                    <th>BBM</th>
                    <th>Total Biaya</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelLogs.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">Belum ada riwayat BBM.</td></tr>
                  ) : (
                    fuelLogs.slice(0, 10).map(log => (
                      <tr key={log.id}>
                        <td style={{ fontSize: '13px' }}>{new Date(log.date).toLocaleDateString('id-ID')}</td>
                        <td style={{ fontWeight: 600 }}>{log.vehicle.name} <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>({log.vehicle.code})</span></td>
                        <td>{log.project?.code || '-'}</td>
                        <td>
                          {log.liters}L <span className="badge badge-gray">{log.fuelType}</span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(log.totalCost)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="card">
          <div className="card-body text-center py-12">
            <Wrench size={48} style={{ color: 'var(--gray-300)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--gray-700)' }}>Modul Perawatan & Servis</h3>
            <p style={{ color: 'var(--gray-500)', marginTop: '8px' }}>Pencatatan ganti oli, penggantian sparepart, dan servis sedang dalam tahap pengembangan UI.</p>
          </div>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-title">Daftar Aset / Kendaraan</div>
            <button className="btn btn-primary btn-sm" onClick={() => setIsVehicleModalOpen(true)}>Tambah Data</button>
          </div>
          <div className="card-body p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Kendaraan / Alat</th>
                  <th>Tipe</th>
                  <th>Nomor Polisi</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600, color: 'var(--navy-700)' }}>{v.code || '-'}</td>
                    <td style={{ fontWeight: 500 }}>{v.name}</td>
                    <td>{v.type}</td>
                    <td>{v.plateNumber || '-'}</td>
                    <td><span className="badge badge-success">{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Vehicle Modal */}
      {isVehicleModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Tambah Kendaraan / Alat Berat</div>
              <button className="btn-close" onClick={() => setIsVehicleModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleVehicleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label required">Nama Alat / Kendaraan</label>
                  <input type="text" className="form-input" value={vName} onChange={e => setVName(e.target.value)} placeholder="Truk Fuso 12 Roda" />
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Kode (Opsional)</label>
                    <input type="text" className="form-input" value={vCode} onChange={e => setVCode(e.target.value)} placeholder="TRK-001" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nomor Polisi</label>
                    <input type="text" className="form-input" value={vPlate} onChange={e => setVPlate(e.target.value)} placeholder="B 1234 XYZ" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label required">Kategori / Tipe</label>
                  <select className="form-input form-select" value={vType} onChange={e => setVType(e.target.value)}>
                    <option value="KENDARAAN">Kendaraan (Mobil, Truk, Pick-Up)</option>
                    <option value="ALAT_BERAT">Alat Berat (Excavator, Buldozer, dll)</option>
                    <option value="GENSET">Genset / Alat Statis</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsVehicleModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
