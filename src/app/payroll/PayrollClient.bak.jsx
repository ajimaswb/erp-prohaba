'use client'

import React, { useState } from 'react'
import { 
  Calculator, CheckCircle, Clock, FileText, ChevronRight, DollarSign, Wallet, ArrowRightCircle 
} from 'lucide-react'

export default function PayrollClient({ payrolls }) {
  const [selectedPayroll, setSelectedPayroll] = useState(payrolls[0] || null)

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'DRAFT': return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold tracking-wider uppercase border border-slate-200 shadow-sm">DRAFT</span>
      case 'SUBMITTED': return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold tracking-wider uppercase border border-blue-200 shadow-sm">Menunggu HRD</span>
      case 'HRD_APPROVED': return <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold tracking-wider uppercase border border-amber-200 shadow-sm">Menunggu Finance</span>
      case 'FINANCE_APPROVED': return <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold tracking-wider uppercase border border-indigo-200 shadow-sm">Menunggu Direktur</span>
      case 'PAID': return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-200 shadow-sm">Dibayar</span>
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold tracking-wider uppercase border border-slate-200 shadow-sm">{status}</span>
    }
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
      
      {/* Sidebar List Payroll */}
      <div className="w-full lg:w-1/3 flex flex-col gap-5">
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Payroll</h1>
            <p className="text-slate-500 text-sm mt-1">Proses & Approval Gaji</p>
          </div>
          <button className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-3 rounded-xl shadow-md shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95">
            <Calculator className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {payrolls.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelectedPayroll(p)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 group ${
                selectedPayroll?.id === p.id 
                ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-800/10 transform scale-[1.02]' 
                : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-500/30 hover:bg-emerald-50/10 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-lg tracking-tight">{p.period}</span>
                {getStatusBadge(p.status)}
              </div>
              <p className={`text-sm mb-4 font-medium ${selectedPayroll?.id === p.id ? 'text-slate-300' : 'text-slate-600 group-hover:text-emerald-700 transition-colors'}`}>
                {p.projectName}
              </p>
              <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200/20">
                <span className={`flex items-center gap-1.5 font-medium ${selectedPayroll?.id === p.id ? 'text-slate-400' : 'text-slate-500'}`}>
                  <UsersIcon className="w-4 h-4" /> {p.employeeCount} Pegawai
                </span>
                <span className="font-bold tracking-tight">{formatCurrency(p.totalAmount)}</span>
              </div>
            </div>
          ))}
          {payrolls.length === 0 && (
            <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-medium">Belum ada data Payroll.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Detail Payroll */}
      <div className="w-full lg:w-2/3">
        {selectedPayroll ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-right-4 duration-500">
            
            {/* Header Detail */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Rincian Gaji Periode {selectedPayroll.period}</h2>
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Proyek: {selectedPayroll.projectName}
                </p>
              </div>
              <div className="md:text-right relative z-10">
                <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Total Tagihan Payroll</p>
                <p className="text-3xl font-black text-slate-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                  {formatCurrency(selectedPayroll.totalAmount)}
                </p>
              </div>
            </div>

            {/* Approval Flow Tracker */}
            <div className="p-6 md:px-12 py-8 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between relative">
                {/* Progress Bar Background */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-slate-100 z-0 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-500 transition-all duration-1000 ${
                    selectedPayroll.status === 'DRAFT' ? 'w-[0%]' :
                    selectedPayroll.status === 'SUBMITTED' ? 'w-[33%]' :
                    selectedPayroll.status === 'HRD_APPROVED' ? 'w-[66%]' :
                    selectedPayroll.status === 'FINANCE_APPROVED' ? 'w-[100%]' :
                    selectedPayroll.status === 'PAID' ? 'w-[100%]' : 'w-[0%]'
                  }`}></div>
                </div>
                
                {/* Step 1: Draft/Submit */}
                <div className="flex flex-col items-center z-10 gap-3 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border ${
                    selectedPayroll.status !== 'DRAFT' 
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-emerald-500 shadow-emerald-500/20' 
                    : 'bg-white text-slate-400 border-slate-200'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${selectedPayroll.status !== 'DRAFT' ? 'text-emerald-700' : 'text-slate-500'}`}>Draft</span>
                </div>

                {/* Step 2: HRD */}
                <div className="flex flex-col items-center z-10 gap-3 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border ${
                    (selectedPayroll.status === 'HRD_APPROVED' || selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') 
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-emerald-500 shadow-emerald-500/20' 
                    : (selectedPayroll.status === 'SUBMITTED' ? 'bg-white text-emerald-500 border-emerald-500 shadow-emerald-500/10' : 'bg-white text-slate-400 border-slate-200')
                  }`}>
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    (selectedPayroll.status === 'HRD_APPROVED' || selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') 
                    ? 'text-emerald-700' : 'text-slate-500'
                  }`}>HRD</span>
                </div>

                {/* Step 3: Finance */}
                <div className="flex flex-col items-center z-10 gap-3 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border ${
                    (selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') 
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-emerald-500 shadow-emerald-500/20' 
                    : (selectedPayroll.status === 'HRD_APPROVED' ? 'bg-white text-emerald-500 border-emerald-500 shadow-emerald-500/10' : 'bg-white text-slate-400 border-slate-200')
                  }`}>
                    <Wallet className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    (selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') 
                    ? 'text-emerald-700' : 'text-slate-500'
                  }`}>Finance</span>
                </div>

                {/* Step 4: Dirut */}
                <div className="flex flex-col items-center z-10 gap-3 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border ${
                    selectedPayroll.status === 'PAID' 
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-emerald-500 shadow-emerald-500/20' 
                    : (selectedPayroll.status === 'FINANCE_APPROVED' ? 'bg-white text-emerald-500 border-emerald-500 shadow-emerald-500/10' : 'bg-white text-slate-400 border-slate-200')
                  }`}>
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${selectedPayroll.status === 'PAID' ? 'text-emerald-700' : 'text-slate-500'}`}>Top Mgmt</span>
                </div>
              </div>
            </div>

            {/* List Karyawan */}
            <div className="flex-1 overflow-y-auto p-0 bg-slate-50/30">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider sticky top-0 z-10 backdrop-blur-md bg-slate-50/90">
                  <tr>
                    <th className="px-6 py-4">PEGAWAI</th>
                    <th className="px-6 py-4">KEHADIRAN</th>
                    <th className="px-6 py-4">GAJI POKOK</th>
                    <th className="px-6 py-4">LEMBUR / TUNJ.</th>
                    <th className="px-6 py-4 text-right">TAKE HOME PAY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedPayroll.items.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-sm border border-emerald-200">
                            {getInitials(item.employeeName)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{item.employeeName}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">{item.workDays} Hari</p>
                        {item.overtime > 0 && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                            <Clock className="w-3 h-3" /> {item.overtime} Jam
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{formatCurrency(item.baseSalary)}</td>
                      <td className="px-6 py-4 space-y-1">
                        {item.allowances > 0 && <p className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded w-fit">+ {formatCurrency(item.allowances)} <span className="opacity-70">(Tunjangan)</span></p>}
                        {item.overtimePay > 0 && <p className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded w-fit">+ {formatCurrency(item.overtimePay)} <span className="opacity-70">(Lembur)</span></p>}
                        {item.deductions > 0 && <p className="text-rose-600 text-xs font-medium bg-rose-50 px-2 py-0.5 rounded w-fit">- {formatCurrency(item.deductions)} <span className="opacity-70">(Potongan)</span></p>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-[15px] text-emerald-700">{formatCurrency(item.netSalary)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="p-5 md:p-6 border-t border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                Data terintegrasi otomatis dari input absensi PJO.
              </p>
              
              <div className="flex gap-3 w-full md:w-auto">
                {selectedPayroll.status === 'DRAFT' && (
                  <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 transform active:scale-95">
                    Submit ke HRD <ArrowRightCircle className="w-5 h-5" />
                  </button>
                )}
                {selectedPayroll.status === 'HRD_APPROVED' && (
                  <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 transform active:scale-95">
                    Setujui (Finance) <ArrowRightCircle className="w-5 h-5" />
                  </button>
                )}
                {selectedPayroll.status === 'FINANCE_APPROVED' && (
                  <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-slate-800/20 transform active:scale-95">
                    Setujui & Bayar (Direktur) <ArrowRightCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center border border-slate-200 rounded-2xl bg-slate-50/50 border-dashed m-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-4">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">Pilih Data Payroll</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-[250px] mx-auto leading-relaxed">Pilih periode payroll di samping untuk melihat rincian kalkulasi gaji dan status persetujuan.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

function UsersIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
