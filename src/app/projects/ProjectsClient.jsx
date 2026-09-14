'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Calendar, MapPin, Search } from 'lucide-react';

export default function ProjectsClient({ initialProjects }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '', name: '', client: '', location: '', contractValue: '', startDate: '', endDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Gagal menambahkan proyek');
      }
      const newProject = await res.json();
      setProjects([newProject, ...projects]);
      setShowModal(false);
      setFormData({ code: '', name: '', client: '', location: '', contractValue: '', startDate: '', endDate: '' });
      router.refresh();
      alert('Proyek berhasil ditambahkan!');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--gray-400)' }} />
          <input type="text" className="form-input" placeholder="Cari proyek..." style={{ paddingLeft: 36 }} />
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} className="inline-block mr-2" />
          Tambah Proyek Baru
        </button>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {projects.map(p => (
          <div key={p.id} className="card" style={{ transition: 'all 0.2s', cursor: 'pointer' }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ 
                    width: 40, height: 40, borderRadius: 8, background: 'var(--navy-50)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-600)'
                  }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{p.code}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{p.client}</div>
                  </div>
                </div>
                <span className={`badge ${p.status === 'ACTIVE' ? 'badge-success' : 'badge-gray'}`}>
                  {p.status}
                </span>
              </div>
              
              <div style={{ fontWeight: 600, color: 'var(--navy-700)', marginBottom: 16, lineHeight: 1.4 }}>
                {p.name}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--gray-600)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={14} /> {p.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={14} /> {new Date(p.startDate).toLocaleDateString('id-ID')} - {new Date(p.endDate).toLocaleDateString('id-ID')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">Tambah Proyek Baru</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                <div className="form-group">
                  <label className="form-label required">Kode Proyek</label>
                  <input type="text" className="form-input" required placeholder="Contoh: PRJ-002"
                    value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label required">Nama Proyek</label>
                  <input type="text" className="form-input" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label required">Klien / Pemilik</label>
                  <input type="text" className="form-input" required
                    value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label required">Lokasi</label>
                  <input type="text" className="form-input" required
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label required">Nilai Kontrak (Rp)</label>
                  <input type="number" className="form-input" required
                    value={formData.contractValue} onChange={e => setFormData({...formData, contractValue: e.target.value})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label required">Tanggal Mulai</label>
                    <input type="date" className="form-input" required
                      value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Tanggal Selesai</label>
                    <input type="date" className="form-input" required
                      value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Proyek'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
