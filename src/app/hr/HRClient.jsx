'use client'

import React, { useState } from 'react'
import { 
  Users, UserPlus, Clock, ClipboardCheck, 
  Calendar, CheckCircle, XCircle, Search, Save, MoreVertical, Building
} from 'lucide-react'

export default function HRClient({ employees, attendances }) {
  const [activeTab, setActiveTab] = useState('employee') // employee, attendance, input
  const [searchEmp, setSearchEmp] = useState('')

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchEmp.toLowerCase()) || 
    emp.employeeNo.toLowerCase().includes(searchEmp.toLowerCase())
  )

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'HADIR': return <span className="badge badge-success"><CheckCircle style={{ width: '12px', height: '12px' }} /> HADIR</span>
      case 'IZIN': return <span className="badge badge-info"><XCircle style={{ width: '12px', height: '12px' }} /> IZIN</span>
      case 'SAKIT': return <span className="badge badge-warning"><XCircle style={{ width: '12px', height: '12px' }} /> SAKIT</span>
      default: return <span className="badge badge-danger"><XCircle style={{ width: '12px', height: '12px' }} /> ALPA</span>
    }
  }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Section */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>HR & Kepegawaian</h1>
          <p>Manajemen data karyawan dan rekap absensi proyek.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building style={{ width: '16px', height: '16px' }} />
            Semua Proyek
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="kpi-grid">
        <div className="kpi-card navy">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="kpi-label">Total Karyawan</p>
              <p className="kpi-value">{employees.length}</p>
            </div>
            <div className="kpi-icon">
              <Users style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
        </div>

        <div className="kpi-card green">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="kpi-label">Hadir Hari Ini</p>
              <p className="kpi-value" style={{ color: 'var(--green-600)' }}>
                {attendances.filter(a => new Date(a.date).toDateString() === new Date().toDateString() && a.status === 'HADIR').length}
              </p>
            </div>
            <div className="kpi-icon">
              <CheckCircle style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
        </div>

        <div className="kpi-card red">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="kpi-label">Tidak Hadir</p>
              <p className="kpi-value" style={{ color: 'var(--red-600)' }}>
                {attendances.filter(a => new Date(a.date).toDateString() === new Date().toDateString() && a.status !== 'HADIR').length}
              </p>
            </div>
            <div className="kpi-icon">
              <XCircle style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
        </div>

        <div className="kpi-card yellow">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="kpi-label">Total Lembur</p>
              <p className="kpi-value" style={{ color: 'var(--yellow-600)' }}>
                {attendances.reduce((acc, a) => acc + (a.overtime || 0), 0)} <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--yellow-500)', opacity: 0.8 }}>Jam</span>
              </p>
            </div>
            <div className="kpi-icon">
              <Clock style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="card">
        
        {/* Modern Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
          {[
            { id: 'employee', icon: Users, label: 'Data Karyawan' },
            { id: 'attendance', icon: Calendar, label: 'Rekap Absensi' },
            { id: 'input', icon: ClipboardCheck, label: 'Input Lapangan' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  position: 'relative',
                  padding: '16px 24px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: isActive ? 'var(--navy-800)' : 'var(--gray-500)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: isActive ? 'white' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--orange-500)' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon style={{ width: '18px', height: '18px', color: isActive ? 'var(--orange-500)' : 'var(--gray-400)' }} /> 
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="card-body">
          {/* TAB: DATA KARYAWAN */}
          {activeTab === 'employee' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
                  <Search style={{ width: '20px', height: '20px', position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input 
                    type="text" 
                    placeholder="Cari NIK / Nama..." 
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                    value={searchEmp}
                    onChange={(e) => setSearchEmp(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary">
                  <UserPlus className="btn-icon" /> 
                  <span>Tambah Pegawai</span>
                </button>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Pegawai</th>
                      <th>ID Pegawai</th>
                      <th>Departemen</th>
                      <th>Status / Tipe</th>
                      <th>Proyek Aktif</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy-100)', color: 'var(--navy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', border: '1px solid var(--navy-200)' }}>
                              {getInitials(emp.name)}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{emp.name}</p>
                              <p style={{ fontSize: '12.5px', color: 'var(--gray-500)', marginTop: '2px' }}>{emp.position}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--gray-700)' }}>{emp.employeeNo}</td>
                        <td style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{emp.department}</td>
                        <td>
                          <span className={
                            emp.employeeType === 'STAFF' ? 'badge badge-info' :
                            emp.employeeType === 'HARIAN' ? 'badge badge-success' :
                            'badge badge-warning'
                          }>
                            {emp.employeeType === 'HARIAN' ? 'Pekerja Harian' : emp.employeeType}
                          </span>
                        </td>
                        <td>
                          <div style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, color: 'var(--gray-700)' }} title={emp.activeProject}>
                            {emp.activeProject}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn-ghost" style={{ padding: '8px', borderRadius: '8px' }}>
                            <MoreVertical style={{ width: '20px', height: '20px' }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: REKAP ABSENSI */}
          {activeTab === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '10px', background: 'white', borderRadius: '10px', border: '1px solid var(--gray-200)' }}>
                    <Calendar style={{ width: '24px', height: '24px', color: 'var(--navy-600)' }} />
                  </div>
                  <div>
                    <h2 style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Filter Riwayat Absensi</h2>
                    <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>Pilih rentang tanggal untuk melihat laporan.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="date" className="form-input" defaultValue={new Date().toISOString().split('T')[0]} />
                  <button className="btn btn-outline">
                    Terapkan
                  </button>
                </div>
              </div>
              
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Nama Pegawai</th>
                      <th>Status</th>
                      <th>Lembur</th>
                      <th>Catatan</th>
                      <th>Diinput Oleh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.map((att) => (
                      <tr key={att.id}>
                        <td style={{ fontWeight: 500, color: 'var(--gray-800)' }}>
                          {new Date(att.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{att.employeeName}</td>
                        <td>
                          {getStatusBadge(att.status)}
                        </td>
                        <td>
                          {att.overtime > 0 ? (
                            <span className="badge badge-warning">
                              <Clock style={{ width: '14px', height: '14px' }} /> {att.overtime} Jam
                            </span>
                          ) : (
                            <span style={{ color: 'var(--gray-400)' }}>-</span>
                          )}
                        </td>
                        <td style={{ color: 'var(--gray-600)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={att.notes}>{att.notes || '-'}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--gray-700)' }}>
                              {getInitials(att.enteredBy)}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)' }}>{att.enteredBy}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: INPUT ABSENSI */}
          {activeTab === 'input' && (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', gap: '20px' }}>
                <div style={{ padding: '12px', background: 'var(--navy-100)', color: 'var(--navy-700)', borderRadius: '12px', height: 'fit-content' }}>
                  <ClipboardCheck style={{ width: '32px', height: '32px' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '18px' }}>Form Input Kehadiran Lapangan</h3>
                  <p style={{ fontSize: '14px', color: 'var(--navy-700)', marginTop: '8px', lineHeight: 1.5 }}>Gunakan form ini untuk mencatat kehadiran harian pekerja lapangan. Data yang diinput akan otomatis terhubung ke perhitungan Payroll.</p>
                </div>
              </div>

              <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label className="form-label required">Tanggal Pekerjaan</label>
                    <input type="date" className="form-input" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Pilih Pekerja</label>
                    <select className="form-select">
                      <option value="">-- Pilih Pekerja Lapangan --</option>
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.name} ({e.employeeType})</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', paddingTop: '24px', borderTop: '1px solid var(--gray-100)' }}>
                  <div className="form-group">
                    <label className="form-label required">Status Kehadiran</label>
                    <select className="form-select" style={{ fontWeight: 600 }}>
                      <option value="HADIR">✅ Hadir (Bekerja)</option>
                      <option value="IZIN">📝 Izin Resmi</option>
                      <option value="SAKIT">🤒 Sakit</option>
                      <option value="TIDAK_HADIR">❌ Mangkir / Alpa</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Jam Lembur</label>
                    <div style={{ position: 'relative' }}>
                      <input type="number" min="0" placeholder="0" className="form-input" style={{ paddingRight: '48px' }} />
                      <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', fontWeight: 600, color: 'var(--gray-400)' }}>Jam</span>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ paddingTop: '24px', borderTop: '1px solid var(--gray-100)' }}>
                  <label className="form-label">Catatan Pekerjaan / Lembur (Opsional)</label>
                  <textarea 
                    rows="3" 
                    placeholder="Contoh: Pekerja lembur untuk menyelesaikan pengecoran pilar blok A..." 
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px' }}>
                  <button className="btn btn-ghost">
                    Batal
                  </button>
                  <button className="btn btn-primary" style={{ padding: '12px 32px' }}>
                    <Save className="btn-icon" /> 
                    Simpan Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
