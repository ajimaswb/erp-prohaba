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

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">HR & Kepegawaian</h1>
          <p className="text-slate-500 mt-1">Manajemen data karyawan dan rekap absensi proyek.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-medium transition-all shadow-sm">
            <Building className="w-4 h-4" />
            Semua Proyek
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-slate-600 transition-colors">Total Karyawan</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{employees.length}</p>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-slate-600 transition-colors">Hadir Hari Ini</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {attendances.filter(a => new Date(a.date).toDateString() === new Date().toDateString() && a.status === 'HADIR').length}
              </p>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <CheckCircle className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-slate-600 transition-colors">Tidak Hadir</p>
              <p className="text-3xl font-bold text-rose-600 mt-2">
                {attendances.filter(a => new Date(a.date).toDateString() === new Date().toDateString() && a.status !== 'HADIR').length}
              </p>
            </div>
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
              <XCircle className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-slate-600 transition-colors">Total Lembur</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">
                {attendances.reduce((acc, a) => acc + (a.overtime || 0), 0)} <span className="text-lg font-medium text-amber-600/70">Jam</span>
              </p>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Modern Tabs */}
        <div className="flex border-b border-slate-200 px-2 pt-2 bg-slate-50/50">
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
                className={`relative px-6 py-4 font-medium flex items-center gap-2.5 transition-colors ${
                  isActive ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-xl'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} /> 
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full shadow-[0_-2px_10px_rgba(5,150,105,0.4)]" />
                )}
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {/* TAB: DATA KARYAWAN */}
          {activeTab === 'employee' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-80 group">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Cari NIK / Nama..." 
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all shadow-sm"
                    value={searchEmp}
                    onChange={(e) => setSearchEmp(e.target.value)}
                  />
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md">
                  <UserPlus className="w-4 h-4" /> 
                  <span>Tambah Pegawai</span>
                </button>
              </div>

              <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Pegawai</th>
                      <th className="px-6 py-4">ID Pegawai</th>
                      <th className="px-6 py-4">Departemen</th>
                      <th className="px-6 py-4">Status / Tipe</th>
                      <th className="px-6 py-4">Proyek Aktif</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-inner border border-emerald-200/50">
                              {getInitials(emp.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">{emp.name}</p>
                              <p className="text-xs text-slate-500">{emp.position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">{emp.employeeNo}</td>
                        <td className="px-6 py-4 font-medium">{emp.department}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            emp.employeeType === 'STAFF' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            emp.employeeType === 'HARIAN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {emp.employeeType === 'HARIAN' ? 'Pekerja Harian' : emp.employeeType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-[150px] truncate text-slate-600 font-medium" title={emp.activeProject}>
                            {emp.activeProject}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-emerald-600 p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5" />
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800">Filter Riwayat Absensi</h2>
                    <p className="text-xs text-slate-500">Pilih rentang tanggal untuk melihat laporan.</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input type="date" className="w-full sm:w-auto border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                  <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-all shadow-sm">
                    Terapkan
                  </button>
                </div>
              </div>
              
              <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Nama Pegawai</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Lembur</th>
                      <th className="px-6 py-4">Catatan</th>
                      <th className="px-6 py-4">Diinput Oleh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendances.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {new Date(att.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{att.employeeName}</td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            att.status === 'HADIR' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            att.status === 'IZIN' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            att.status === 'SAKIT' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {att.status === 'HADIR' && <CheckCircle className="w-3 h-3" />}
                            {att.status !== 'HADIR' && <XCircle className="w-3 h-3" />}
                            {att.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {att.overtime > 0 ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded border border-amber-100">
                              <Clock className="w-3 h-3" /> {att.overtime} Jam
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate" title={att.notes}>{att.notes || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                              {getInitials(att.enteredBy)}
                            </div>
                            <span className="text-xs font-medium text-slate-600">{att.enteredBy}</span>
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
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-8 flex gap-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg h-fit">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Form Input Kehadiran Lapangan</h3>
                  <p className="text-sm text-blue-700 mt-1">Gunakan form ini untuk mencatat kehadiran harian pekerja lapangan. Data yang diinput akan otomatis terhubung ke perhitungan Payroll.</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Tanggal Pekerjaan</label>
                      <input type="date" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Pilih Pekerja</label>
                      <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all appearance-none cursor-pointer">
                        <option value="">-- Pilih Pekerja Lapangan --</option>
                        {employees.map(e => (
                          <option key={e.id} value={e.id}>{e.name} ({e.employeeType})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Status Kehadiran</label>
                      <div className="relative">
                        <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all appearance-none cursor-pointer font-medium">
                          <option value="HADIR">✅ Hadir (Bekerja)</option>
                          <option value="IZIN">📝 Izin Resmi</option>
                          <option value="SAKIT">🤒 Sakit</option>
                          <option value="TIDAK_HADIR">❌ Mangkir / Alpa</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Total Jam Lembur</label>
                      <div className="relative">
                        <input type="number" min="0" placeholder="0" className="w-full border border-slate-200 rounded-xl pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">Jam</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="text-sm font-semibold text-slate-700">Catatan Pekerjaan / Lembur (Opsional)</label>
                    <textarea 
                      rows="3" 
                      placeholder="Contoh: Pekerja lembur untuk menyelesaikan pengecoran pilar blok A..." 
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-6 flex justify-end gap-3">
                    <button className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                      Batal
                    </button>
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 text-white px-8 py-2.5 rounded-xl font-medium transition-all transform active:scale-95">
                      <Save className="w-4 h-4" /> 
                      Simpan Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
