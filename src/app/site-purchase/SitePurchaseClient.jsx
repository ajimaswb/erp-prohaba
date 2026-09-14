'use client';

import { useState } from 'react';
import { ShoppingBag, AlertTriangle, CheckCircle, ShieldAlert, FileText, Search, Plus } from 'lucide-react';

export default function SitePurchaseClient({ sitePurchases, projects, projectDict, priceReferences, user }) {
  const [activeTab, setActiveTab] = useState('list');
  const [searchCode, setSearchCode] = useState('');
  const [refPriceFound, setRefPriceFound] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const checkPrice = (code) => {
    const ref = priceReferences.find(r => r.itemCode === code || r.description.toLowerCase().includes(code.toLowerCase()));
    setRefPriceFound(ref || null);
  };

  return (
    <>
      {/* Alert Banner for Top Management / Finance */}
      {sitePurchases.some(sp => sp.priceFlag && sp.status === 'PENDING') && (
        <div className="alert alert-danger" style={{ marginBottom: 20 }}>
          <ShieldAlert size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Peringatan Anti-Markup!</strong> Terdapat transaksi Site Purchase yang terindikasi Mark-up (&gt;10% dari harga referensi pasar) dan membutuhkan tinjauan segera.
          </div>
        </div>
      )}

      <div className="tabs">
        <button className={`tab ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          <FileText size={16} className="inline-block mr-2" />
          Riwayat Pembelian Site
        </button>
        {(user.role === 'PJO' || user.role === 'LOGISTIK') && (
          <button className={`tab ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
            <Plus size={16} className="inline-block mr-2" />
            Input Bon Baru
          </button>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="card">
          <div className="card-body p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Proyek</th>
                  <th>Deskripsi Item</th>
                  <th>Qty</th>
                  <th>Harga Satuan</th>
                  <th>Total</th>
                  <th>Status Anti-Markup</th>
                </tr>
              </thead>
              <tbody>
                {sitePurchases.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-500">Belum ada transaksi Site Purchase.</td></tr>
                ) : (
                  sitePurchases.map(sp => (
                    <tr key={sp.id} style={{ background: sp.priceFlag && sp.status === 'PENDING' ? 'var(--red-50)' : 'transparent' }}>
                      <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>{new Date(sp.purchaseDate).toLocaleDateString('id-ID')}</td>
                      <td>{projectDict[sp.projectId]}</td>
                      <td style={{ fontWeight: 500 }}>
                        {sp.description}
                        <br />
                        <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>{sp.vendor}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{sp.quantity} {sp.unit}</td>
                      <td>{formatCurrency(sp.unitPrice)}</td>
                      <td style={{ fontWeight: 700, color: 'var(--navy-700)' }}>{formatCurrency(sp.totalAmount)}</td>
                      <td>
                        {sp.priceFlag ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span className="badge badge-danger">
                              <AlertTriangle size={12} className="mr-1 inline" /> Terindikasi Mark-up (+{sp.flagPct}%)
                            </span>
                            {sp.status === 'PENDING' ? (
                              <button className="btn btn-sm btn-outline" style={{ fontSize: 11, padding: '2px 8px' }}>Review</button>
                            ) : (
                              <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>Di-approve secara manual</span>
                            )}
                          </div>
                        ) : (
                          <span className="badge badge-success">
                            <CheckCircle size={12} className="mr-1 inline" /> Wajar
                          </span>
                        )}
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
            <div className="card-title">Form Input Pembelian Lapangan (Site Purchase)</div>
          </div>
          <div className="card-body">
            <div className="alert alert-warning">
              <Info size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Perhatian:</strong> Semua input harga akan otomatis divalidasi oleh sistem Anti-Markup berdasarkan database Referensi Harga. Mark-up di atas 10% akan memicu <i>Red Flag</i> ke Top Management.
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">Proyek</label>
                <select className="form-input form-select">
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label required">Tanggal Beli (di Nota)</label>
                <input type="date" className="form-input" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label required">Nama Toko / Supplier Lokal</label>
              <input type="text" className="form-input" placeholder="Toko Material Maju Bersama..." />
            </div>

            <hr style={{ margin: '24px 0', borderTop: '1px solid var(--gray-200)' }} />

            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div className="form-group">
                  <label className="form-label required">Nama Barang (Cek Referensi)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ketik kode atau nama barang (cth: Semen, Besi)..." 
                      value={searchCode}
                      onChange={e => setSearchCode(e.target.value)}
                    />
                    <button className="btn btn-outline" onClick={() => checkPrice(searchCode)}>
                      <Search size={16} />
                    </button>
                  </div>
                </div>

                {refPriceFound && (
                  <div style={{ padding: '12px', background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 'var(--radius-md)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green-800)', textTransform: 'uppercase' }}>Harga Referensi Ditemukan</div>
                      <div style={{ fontWeight: 500, color: 'var(--green-900)' }}>{refPriceFound.description}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-700)' }}>{formatCurrency(refPriceFound.refPrice)}</div>
                      <div style={{ fontSize: 11, color: 'var(--green-600)' }}>per {refPriceFound.unit}</div>
                    </div>
                  </div>
                )}
                {!refPriceFound && searchCode && (
                  <div style={{ padding: '12px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 12, color: 'var(--gray-600)' }}>
                    Item tidak ditemukan di database referensi pusat. Validasi harga akan masuk dalam review manual (Pending).
                  </div>
                )}

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label required">Kuantitas</label>
                    <input type="number" className="form-input" placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Satuan</label>
                    <input type="text" className="form-input" placeholder="Sak / Btg" defaultValue={refPriceFound?.unit || ''} />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Harga Satuan (Nota)</label>
                    <input type="number" className="form-input" placeholder="Rp..." />
                  </div>
                </div>
              </div>
              
              <div style={{ width: 300, background: 'var(--gray-50)', border: '1px dashed var(--gray-300)', borderRadius: 'var(--radius-md)', padding: 20, textAlign: 'center' }}>
                <div style={{ marginBottom: 12, color: 'var(--gray-500)' }}>Upload Foto Bon/Nota</div>
                <ShoppingBag size={32} style={{ margin: '0 auto 12px', color: 'var(--gray-400)' }} />
                <button className="btn btn-sm btn-outline" style={{ width: '100%' }}>Pilih Foto</button>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Keterangan / Alasan Pembelian Mendadak</label>
              <textarea className="form-input" rows="2" placeholder="Jelaskan mengapa barang tidak di-request melalui pusat..."></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setActiveTab('list')}>Batal</button>
              <button className="btn btn-primary">
                <CheckCircle size={16} className="inline-block mr-2" />
                Submit Bukti Pembelian
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
