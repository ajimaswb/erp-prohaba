'use client'

import React, { useState } from 'react'
import { 
  Users, UserPlus, Clock, ClipboardCheck, 
  Calendar, CheckCircle, XCircle, Search, Save
} from 'lucide-react'

export default function HRClient({ employees, attendances }) {
  const [activeTab, setActiveTab] = useState('employee') // employee, attendance, input
  const [searchEmp, setSearchEmp] = useState('')

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchEmp.toLowerCase()) || 
    emp.employeeNo.toLowerCase().includes(searchEmp.toLowerCase())
  )

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">HR & Kepegawaian</h1>
        <p className="text-slate-500">Manajemen data karyawan dan rekap absensi proyek.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Karyawan</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{employees.length}</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-full">
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Hadir Hari Ini</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">
              {attendances.filter(a => new Date(a.date).toDateString() === new Date().toDateString() && a.status === 'HADIR').length}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-full">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Tidak Hadir</p>
            <p className="text-3xl font-bold text-rose-600 mt-1">
              {attendances.filter(a => new Date(a.date).toDateString() === new Date().toDateString() && a.status !== 'HADIR').length}
            </p>
          </div>
          <div className="p-4 bg-rose-50 rounded-full">
            <XCircle className="w-8 h-8 text-rose-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Lembur (Bulan Ini)</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">
              {attendances.reduce((acc, a) => acc + (a.overtime || 0), 0)} Jam
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-full">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button 
            className={`px-6 py-4 font-medium flex items-center gap-2 ${activeTab === 'employee' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('employee')}
          >
            <Users className="w-4 h-4" /> Data Karyawan
          </button>
          <button 
            className={`px-6 py-4 font-medium flex items-center gap-2 ${activeTab === 'attendance' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('attendance')}
          >
            <Calendar className="w-4 h-4" /> Rekap Absensi
          </button>
          <button 
            className={`px-6 py-4 font-medium flex items-center gap-2 ${activeTab === 'input' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('input')}
          >
            <ClipboardCheck className="w-4 h-4" /> Input Absensi Lapangan
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'employee' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-72">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari NIK / Nama..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={searchEmp}
                    onChange={(e) => setSearchEmp(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <UserPlus className="w-4 h-4" /> Tambah Karyawan
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-semibold">NO. PEGAWAI</th>
                      <th className="px-6 py-4 font-semibold">NAMA</th>
                      <th className="px-6 py-4 font-semibold">DEPARTEMEN</th>
                      <th className="px-6 py-4 font-semibold">TIPE</th>
                      <th className="px-6 py-4 font-semibold">PROYEK AKTIF</th>
                      <th className="px-6 py-4 font-semibold text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{emp.employeeNo}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.position}</p>
                        </td>
                        <td className="px-6 py-4">{emp.department}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            emp.employeeType === 'STAFF' ? 'bg-blue-100 text-blue-700' :
                            emp.employeeType === 'HARIAN' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {emp.employeeType}
                          </span>
                        </td>
                        <td className="px-6 py-4">{emp.activeProject}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Log Absensi Terbaru</h2>
                <input type="date" className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-semibold">TANGGAL</th>
                      <th className="px-6 py-4 font-semibold">NAMA PEGAWAI</th>
                      <th className="px-6 py-4 font-semibold">STATUS</th>
                      <th className="px-6 py-4 font-semibold">LEMBUR</th>
                      <th className="px-6 py-4 font-semibold">CATATAN</th>
                      <th className="px-6 py-4 font-semibold">DIINPUT OLEH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {attendances.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">{new Date(att.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">{att.employeeName}</td>
                        <td className="px-6 py-4">
                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            att.status === 'HADIR' ? 'bg-emerald-100 text-emerald-700' :
                            att.status === 'IZIN' ? 'bg-blue-100 text-blue-700' :
                            att.status === 'SAKIT' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {att.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-amber-600">{att.overtime > 0 ? `${att.overtime} Jam` : '-'}</td>
                        <td className="px-6 py-4 text-slate-500 italic">{att.notes || '-'}</td>
                        <td className="px-6 py-4">{att.enteredBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'input' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Input Absensi Harian (Khusus PJO/Mandor)</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                    <input type="date" className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Karyawan</label>
                    <select className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                      <option>-- Pilih Karyawan --</option>
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.name} ({e.employeeNo})</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status Kehadiran</label>
                    <select className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                      <option value="HADIR">Hadir</option>
                      <option value="IZIN">Izin</option>
                      <option value="SAKIT">Sakit</option>
                      <option value="TIDAK_HADIR">Tanpa Keterangan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jam Lembur (Opsional)</label>
                    <input type="number" min="0" placeholder="0" className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Tambahan</label>
                  <textarea rows="3" placeholder="Contoh: Lembur pengecoran pilar..." className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                    <Save className="w-4 h-4" /> Simpan Absensi
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
