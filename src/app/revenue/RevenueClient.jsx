'use client';

import { useState, useMemo } from 'react';
import { 
  Banknote, Search, Plus, FileText, ChevronDown, Check, X, Printer, FileDown
} from 'lucide-react';

export default function RevenueClient({ invoices, projects }) {
  const [search, setSearch] = useState('');
  const [filterProject, setFilterProject] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [printInvoice, setPrintInvoice] = useState(null);

  const [formData, setFormData] = useState({
    projectId: '',
    description: '',
    subTotal: '',
    taxRate: '11',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    category: 'TERMIN',
    downPaymentId: ''
  });

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch = inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) || 
                          inv.description.toLowerCase().includes(search.toLowerCase());
      const matchProject = filterProject === 'ALL' || inv.projectId === filterProject;
      return matchSearch && matchProject;
    });
  }, [invoices, search, filterProject]);

  const downPaymentOptions = useMemo(() => {
    if (!formData.projectId) return [];
    return invoices.filter(inv => inv.projectId === formData.projectId && inv.category === 'DP' && inv.status === 'UNPAID');
  }, [invoices, formData.projectId]);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);
  };

  const handlePrint = (invoice) => {
    setPrintInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Gagal menyimpan tagihan');
      
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Gagal membuat tagihan. Pastikan data terisi dengan benar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    if (!confirm(`Tandai tagihan sebagai ${status}?`)) return;
    try {
      await fetch(`/api/revenue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus tagihan ini secara permanen beserta jurnalnya?')) return;
    try {
      await fetch(`/api/revenue/${id}`, { method: 'DELETE' });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Faktur Penjualan</h2>
          <p className="text-sm text-zinc-400 mt-1">Kelola penagihan, termin, dan uang muka.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-4 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Buat Faktur</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari Faktur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
        
        <div className="relative w-64">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full pl-4 pr-10 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white appearance-none focus:outline-none focus:border-white/20"
          >
            <option value="ALL">Semua Proyek</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* INVOICE LIST */}
      <div className="grid gap-4">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/30 rounded-xl border border-white/5">
            <FileText size={32} className="mx-auto text-zinc-600 mb-3" />
            <h3 className="text-zinc-300 font-medium">Belum Ada Faktur</h3>
            <p className="text-zinc-500 text-sm mt-1">Faktur penjualan dan penagihan akan muncul di sini.</p>
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <div key={inv.id} className="bg-zinc-900/50 border border-white/5 rounded-xl p-5 hover:bg-zinc-900/80 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/10">
                    <Banknote size={20} className="text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium flex items-center gap-2">
                      {inv.invoiceNo}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        inv.status === 'PAID' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {inv.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-white/10">
                        {inv.category}
                      </span>
                    </h4>
                    <p className="text-sm text-zinc-500 mt-1">{inv.project?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handlePrint(inv)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Cetak PDF">
                    <Printer size={16} />
                  </button>
                  {inv.status === 'UNPAID' && (
                    <button onClick={() => handleUpdateStatus(inv.id, 'PAID')} className="p-2 text-zinc-400 hover:text-green-400 hover:bg-zinc-800 rounded-lg transition-colors" title="Tandai Lunas">
                      <Check size={16} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(inv.id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors" title="Hapus">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 py-4 border-y border-white/5">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Tanggal</p>
                  <p className="text-sm text-zinc-300">{new Date(inv.date).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Deskripsi</p>
                  <p className="text-sm text-zinc-300">{inv.description}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Subtotal (DP Dipotong)</p>
                  <p className="text-sm text-zinc-300">{formatRupiah(inv.subTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Total (+PPN)</p>
                  <p className="text-sm font-medium text-white">{formatRupiah(inv.totalAmount)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL BUAT FAKTUR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Buat Faktur Baru</h3>
              <p className="text-sm text-zinc-400 mt-1">Isi rincian penagihan untuk dicetak dan dibukukan.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Proyek</label>
                  <select
                    required
                    value={formData.projectId}
                    onChange={e => setFormData({...formData, projectId: e.target.value, downPaymentId: ''})}
                    className="w-full px-4 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="">Pilih Proyek...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Kategori</label>
                    <select
                      required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                    >
                      <option value="TERMIN">Termin</option>
                      <option value="PROGRESS_BILLING">Progress Billing</option>
                      <option value="DP">Uang Muka</option>
                      <option value="RETENTION_RELEASE">Pelepasan Retensi</option>
                    </select>
                  </div>
                  {formData.category !== 'DP' && downPaymentOptions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1.5">Potong Uang Muka</label>
                      <select
                        value={formData.downPaymentId}
                        onChange={e => setFormData({...formData, downPaymentId: e.target.value})}
                        className="w-full px-4 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                      >
                        <option value="">Tidak Ada</option>
                        {downPaymentOptions.map(dp => (
                          <option key={dp.id} value={dp.id}>{dp.invoiceNo} - {formatRupiah(dp.subTotal)}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Deskripsi Penagihan</label>
                  <input
                    required
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Contoh: Tagihan Termin 1 30%"
                    className="w-full px-4 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Subtotal</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.subTotal}
                      onChange={e => setFormData({...formData, subTotal: e.target.value})}
                      placeholder="0"
                      className="w-full px-4 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">PPN (%)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.taxRate}
                      onChange={e => setFormData({...formData, taxRate: e.target.value})}
                      className="w-full px-4 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Tanggal</label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Jatuh Tempo</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={e => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full px-4 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Faktur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE CSS AND TEMPLATE */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #printable-invoice, #printable-invoice * { visibility: visible; }
          #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; color: black !important; background: white !important; }
        }
      `}} />

      {printInvoice && (
        <div id="printable-invoice" className="hidden print:block p-8 bg-white text-black max-w-4xl mx-auto">
          <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">FAKTUR PENJUALAN</h1>
              <p className="text-gray-500 mt-1">{printInvoice.invoiceNo}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold">PT. Prohaba Jaya Mandiri</h2>
              <p className="text-sm text-gray-600 mt-1">Jl. Contoh Alamat Bisnis No. 123</p>
              <p className="text-sm text-gray-600">NPWP: 01.234.567.8-901.000</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-gray-500 font-medium">Ditagihkan Kepada:</p>
              <p className="text-lg font-semibold mt-1">{printInvoice.project?.client || 'Klien Proyek'}</p>
              <p className="text-sm text-gray-600">Proyek: {printInvoice.project?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Tanggal Faktur:</p>
              <p className="text-base font-medium">{new Date(printInvoice.date).toLocaleDateString('id-ID')}</p>
              {printInvoice.dueDate && (
                <>
                  <p className="text-sm text-gray-500 font-medium mt-2">Jatuh Tempo:</p>
                  <p className="text-base font-medium">{new Date(printInvoice.dueDate).toLocaleDateString('id-ID')}</p>
                </>
              )}
            </div>
          </div>

          <table className="w-full text-left mb-8">
            <thead>
              <tr className="border-y border-gray-300">
                <th className="py-3 px-4 font-semibold text-gray-700">Keterangan</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-right">Kategori</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4">{printInvoice.description}</td>
                <td className="py-4 px-4 text-right">{printInvoice.category}</td>
                <td className="py-4 px-4 text-right font-medium">{formatRupiah(printInvoice.subTotal)}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mb-12">
            <div className="w-1/2 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatRupiah(printInvoice.subTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>PPN ({printInvoice.taxRate}%)</span>
                <span>{formatRupiah(printInvoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-300 pt-3">
                <span>Total Tagihan</span>
                <span>{formatRupiah(printInvoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end mt-24">
            <div>
              <p className="text-sm text-gray-500 mb-2">Instruksi Pembayaran:</p>
              <p className="text-sm font-medium">Bank BCA - 1234567890</p>
              <p className="text-sm font-medium">a.n PT. Prohaba Jaya Mandiri</p>
            </div>
            <div className="text-center">
              <div className="border-b border-gray-400 w-48 mb-2"></div>
              <p className="text-sm font-medium">Manajemen Keuangan</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
