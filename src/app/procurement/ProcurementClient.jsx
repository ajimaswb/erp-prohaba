'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, CheckCircle, Clock, Truck, FileText, FileSignature, Info } from 'lucide-react';

export default function ProcurementClient({ purchaseOrders, materialRequests, vendors, user }) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedMR, setSelectedMR] = useState(materialRequests[0] || null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CREATED': return <span className="badge badge-gray">Draft</span>;
      case 'SENT': return <span className="badge badge-info"><FileSignature size={12} className="mr-1 inline" /> Terkirim ke Vendor</span>;
      case 'CONFIRMED': return <span className="badge badge-primary"><CheckCircle size={12} className="mr-1 inline" /> Dikonfirmasi</span>;
      case 'DELIVERED': return <span className="badge badge-success"><Truck size={12} className="mr-1 inline" /> Terkirim ke Site</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <>
      <div className="tabs">
        <button className={`tab ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          <FileText size={16} className="inline-block mr-2" />
          Daftar Purchase Order
        </button>
        {user.role === 'LOGISTIK' && (
          <button className={`tab ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
            <Plus size={16} className="inline-block mr-2" />
            Buat PO dari MR
          </button>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="card">
          <div className="card-body p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>No. PO</th>
                  <th>Proyek</th>
                  <th>Vendor</th>
                  <th>Total Nilai</th>
                  <th>Status</th>
                  <th>Referensi MR</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-500">Belum ada Purchase Order.</td></tr>
                ) : (
                  purchaseOrders.map(po => (
                    <tr key={po.id}>
                      <td style={{ fontWeight: 700, color: 'var(--navy-700)' }}>{po.poNumber}</td>
                      <td>{po.project.code}</td>
                      <td>{po.vendor.name}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(po.totalAmount)}</td>
                      <td>{getStatusBadge(po.status)}</td>
                      <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>{po.mr?.mrNumber || '-'}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>{new Date(po.createdAt).toLocaleDateString('id-ID')}</td>
                      <td>
                        <button className="btn btn-sm btn-outline">Lihat Detail</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Buat Purchase Order Baru</div>
          </div>
          <div className="card-body">
            <div className="alert alert-info">
              <Info size={16} style={{ flexShrink: 0 }} />
              Pilih Material Request (MR) yang sudah disetujui untuk di-convert menjadi Purchase Order (PO).
            </div>

            <div className="form-grid" style={{ marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label required">Sumber MR</label>
                <select className="form-input form-select" onChange={e => {
                  const mr = materialRequests.find(m => m.id === e.target.value);
                  setSelectedMR(mr);
                }}>
                  {materialRequests.length === 0 && <option>-- Tidak ada MR siap proses --</option>}
                  {materialRequests.map(mr => (
                    <option key={mr.id} value={mr.id}>{mr.mrNumber} - {mr.project.code}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label required">Pilih Vendor</label>
                <select className="form-input form-select">
                  <option value="">-- Pilih Vendor --</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.code})</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedMR && (
              <div style={{ marginBottom: 20 }}>
                <label className="form-label required">Item untuk dipesan</label>
                <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <table className="table">
                    <thead style={{ background: 'var(--gray-50)' }}>
                      <tr>
                        <th>Deskripsi Barang</th>
                        <th>Satuan</th>
                        <th>Kuantitas (MR)</th>
                        <th>Harga Satuan (Estimasi)</th>
                        <th>Total Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMR.items.map((item, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: 500 }}>{item.description}</td>
                          <td>{item.unit}</td>
                          <td style={{ fontWeight: 600 }}>{item.quantity}</td>
                          <td><input type="number" className="form-input" placeholder="Rp..." /></td>
                          <td><span style={{ fontWeight: 600, color: 'var(--gray-500)' }}>Rp 0</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Catatan Pengiriman</label>
              <textarea className="form-input" rows="3" placeholder="Alamat site, kontak penerima, instruksi khusus..."></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setActiveTab('list')}>Batal</button>
              <button className="btn btn-primary" disabled={materialRequests.length === 0}>
                <ShoppingCart size={16} className="inline-block mr-2" />
                Terbitkan PO
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
