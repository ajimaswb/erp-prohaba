'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, UserPlus, Clock, ClipboardCheck, 
  Calendar, CheckCircle, XCircle, Search, Save, MoreVertical, Building
} from 'lucide-react'
import { useDialog } from '@/components/DialogProvider';

export default function HRClient({ employees, attendances }) {
  const [activeTab, setActiveTab] = useState('employee') // employee, attendance, input
  const [searchEmp, setSearchEmp] = useState('')
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    employeeId: '',
    status: 'HADIR',
    overtime: 0,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  
  const { showAlert } = useDialog();

  const handleSubmit = async () => {
    try {
      if (!formData.employeeId) {
        await showAlert('Pilih pekerja.', 'Peringatan')
        return
      }
      setLoading(true)
      const res = await fetch('/api/hr/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Gagal menyimpan absensi')
      
      await showAlert('Data absensi berhasil disimpan!', 'Sukses')
      window.location.reload()
    } catch (err) {
      await showAlert(err.message, 'Error')
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchEmp.toLowerCase()) || 
    emp.employeeNo.toLowerCase().includes(searchEmp.toLowerCase())
  )

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'HADIR': return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> HADIR</span>
      case 'IZIN': return <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> IZIN</span>
      case 'SAKIT': return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> SAKIT</span>
      default: return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> ALPA</span>
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-16px' }} variants={itemVariants}>
        
        <div className="page-header-actions">
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', background: 'white', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-200)' }}>
            <Building style={{ width: '18px', height: '18px', color: 'var(--navy-600)' }} />
            <span style={{ fontWeight: 600 }}>Semua Proyek</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div className="kpi-grid" variants={itemVariants}>
        <div className="kpi-card" style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Karyawan</p>
              <p style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px' }}>{employees.length}</p>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} color="white" />
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hadir Hari Ini</p>
              <p style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px' }}>
                {attendances.filter(a => new Date(a.date).toDateString() === new Date().toDateString() && a.status === 'HADIR').length}
              </p>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={24} color="white" />
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tidak Hadir</p>
              <p style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px' }}>
                {attendances.filter(a => new Date(a.date).toDateString() === new Date().toDateString() && a.status !== 'HADIR').length}
              </p>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={24} color="white" />
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Lembur</p>
              <p style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                {attendances.reduce((acc, a) => acc + (a.overtime || 0), 0)} <span style={{ fontSize: '16px', fontWeight: 600, opacity: 0.8 }}>Jam</span>
              </p>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} color="white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div className="card" style={{ overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--gray-200)', borderRadius: '16px' }} variants={itemVariants}>
        
        {/* Modern Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--gray-200)',
          background: 'var(--gray-50)',
          position: 'relative',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          flexShrink: 0,
        }}>
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
                  padding: '14px 20px',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  color: isActive ? 'var(--navy-800)' : 'var(--gray-500)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  zIndex: 1,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--orange-500)' : 'var(--gray-400)', transition: 'all 0.3s ease', flexShrink: 0 }} /> 
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="hr-tab-indicator"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'var(--orange-500)',
                      borderTopLeftRadius: '3px',
                      borderTopRightRadius: '3px'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="card-body" style={{ padding: '24px' }}>
          <AnimatePresence mode="wait">
            {/* TAB: DATA KARYAWAN */}
            {activeTab === 'employee' && (
              <motion.div 
                key="employee"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                    <Search style={{ width: '20px', height: '20px', position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                    <input 
                      type="text" 
                      placeholder="Cari NIK / Nama..." 
                      className="form-input"
                      style={{ paddingLeft: '44px', borderRadius: '12px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', height: '44px' }}
                      value={searchEmp}
                      onChange={(e) => setSearchEmp(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary" style={{ height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserPlus size={18} /> 
                    <span>Tambah Pegawai</span>
                  </button>
                </div>

                <div className="table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
                  <table>
                    <thead style={{ background: 'var(--gray-50)' }}>
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
                        <tr key={emp.id} style={{ transition: 'background 0.2s ease', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ 
                                width: '42px', height: '42px', borderRadius: '50%', 
                                background: 'linear-gradient(135deg, var(--navy-600), var(--orange-500))', 
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                fontWeight: 700, fontSize: '14px', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                              }}>
                                {getInitials(emp.name)}
                              </div>
                              <div>
                                <p style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '14px' }}>{emp.name}</p>
                                <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px', fontWeight: 500 }}>{emp.position}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--gray-700)', fontSize: '13.5px' }}>{emp.employeeNo}</td>
                          <td style={{ fontWeight: 500, color: 'var(--gray-800)', fontSize: '13.5px' }}>{emp.department}</td>
                          <td>
                            <span className={
                              emp.employeeType === 'STAFF' ? 'badge badge-info' :
                              emp.employeeType === 'HARIAN' ? 'badge badge-success' :
                              'badge badge-warning'
                            } style={{ padding: '6px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '12px' }}>
                              {emp.employeeType === 'HARIAN' ? 'Pekerja Harian' : emp.employeeType}
                            </span>
                          </td>
                          <td>
                            <div style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, color: 'var(--gray-700)', fontSize: '13.5px' }} title={emp.activeProject}>
                              {emp.activeProject}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn-ghost" style={{ padding: '8px', borderRadius: '8px', color: 'var(--gray-500)' }}>
                              <MoreVertical size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB: REKAP ABSENSI */}
            {activeTab === 'attendance' && (
              <motion.div 
                key="attendance"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: 'linear-gradient(to right, var(--navy-50), white)', padding: '20px', borderRadius: '12px', border: '1px solid var(--navy-100)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', background: 'white', borderRadius: '12px', border: '1px solid var(--navy-200)', boxShadow: 'var(--shadow-sm)' }}>
                      <Calendar size={24} style={{ color: 'var(--navy-600)' }} />
                    </div>
                    <div>
                      <h2 style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '16px' }}>Filter Riwayat Absensi</h2>
                      <p style={{ fontSize: '13px', color: 'var(--navy-600)', marginTop: '2px' }}>Filter riwayat berdasarkan tanggal.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="date" className="form-input" style={{ borderRadius: '10px', border: '1px solid var(--gray-300)', height: '42px' }} defaultValue={new Date().toISOString().split('T')[0]} />
                    <button className="btn btn-primary" style={{ height: '42px', borderRadius: '10px' }}>
                      Terapkan Filter
                    </button>
                  </div>
                </div>
                
                <div className="table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
                  <table>
                    <thead style={{ background: 'var(--gray-50)' }}>
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
                        <tr key={att.id} style={{ transition: 'background 0.2s ease', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ fontWeight: 600, color: 'var(--gray-800)', fontSize: '13.5px' }}>
                            {new Date(att.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '14px' }}>{att.employeeName}</td>
                          <td>
                            {getStatusBadge(att.status)}
                          </td>
                          <td>
                            {att.overtime > 0 ? (
                              <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                <Clock size={14} /> {att.overtime} Jam
                              </span>
                            ) : (
                              <span style={{ color: 'var(--gray-400)' }}>-</span>
                            )}
                          </td>
                          <td style={{ color: 'var(--gray-600)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13.5px' }} title={att.notes}>{att.notes || '-'}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--navy-50)', border: '1px solid var(--navy-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--navy-700)' }}>
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
              </motion.div>
            )}

            {/* TAB: INPUT ABSENSI */}
            {activeTab === 'input' && (
              <motion.div 
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px', margin: '0 auto' }}
              >
                                <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', borderRadius: '16px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-lg)' }}>

                <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--gray-200)' }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '18px' }}>Input Kehadiran</h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '4px' }}>Catat kehadiran harian pekerja lapangan.</p>
                </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                      <label className="form-label required">Tanggal Pekerjaan</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        style={{ height: '48px', borderRadius: '10px', background: 'var(--gray-50)' }}
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label required">Pilih Pekerja</label>
                      <select 
                        className="form-select"
                        style={{ height: '48px', borderRadius: '10px', background: 'var(--gray-50)', fontWeight: 500 }}
                        value={formData.employeeId}
                        onChange={e => setFormData({...formData, employeeId: e.target.value})}
                      >
                        <option value="">Pilih Pekerja</option>
                        {employees.map(e => (
                          <option key={e.id} value={e.id}>{e.name} </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', paddingTop: '24px', borderTop: '1px dashed var(--gray-200)' }}>
                    <div className="form-group">
                      <label className="form-label required">Status Kehadiran</label>
                      <select 
                        className="form-select" 
                        style={{ height: '48px', borderRadius: '10px', background: 'var(--gray-50)', fontWeight: 600 }}
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="HADIR">Hadir</option>
                        <option value="IZIN">Izin</option>
                        <option value="SAKIT"> Sakit</option>
                        <option value="TIDAK_HADIR">Alpa</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Total Jam Lembur</label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="number" 
                          min="0" 
                          placeholder="0" 
                          className="form-input" 
                          style={{ height: '48px', borderRadius: '10px', background: 'var(--gray-50)', paddingRight: '56px', fontWeight: 600 }} 
                          value={formData.overtime}
                          onChange={e => setFormData({...formData, overtime: parseFloat(e.target.value) || 0})}
                        />
                        <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 700, color: 'var(--gray-400)' }}>Jam</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group" style={{ paddingTop: '24px', borderTop: '1px dashed var(--gray-200)' }}>
                    <label className="form-label">Catatan</label>
                    <textarea 
                      rows="3" 
                      placeholder="Contoh: Pekerja lembur untuk menyelesaikan pengecoran pilar blok A..." 
                      className="form-input"
                      style={{ resize: 'vertical', borderRadius: '10px', background: 'var(--gray-50)', padding: '16px' }}
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingTop: '16px' }}>
                    <button className="btn btn-ghost" style={{ padding: '12px 24px', borderRadius: '10px', fontWeight: 600 }} onClick={() => setActiveTab('employee')} disabled={loading}>
                      Batal
                    </button>
                    <button className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleSubmit} disabled={loading}>
                      <Save size={20} /> 
                      {loading ? 'Menyimpan...' : 'Simpan Data Absensi'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
