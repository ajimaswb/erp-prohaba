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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'DRAFT': return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">DRAFT</span>
      case 'SUBMITTED': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">Menunggu HRD</span>
      case 'HRD_APPROVED': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200">Menunggu Finance</span>
      case 'FINANCE_APPROVED': return <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">Menunggu Direktur</span>
      case 'PAID': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">Dibayar</span>
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{status}</span>
    }
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto flex gap-6">
      
      {/* Sidebar List Payroll */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Payroll</h1>
            <p className="text-slate-500 text-sm">Proses & Approval Gaji</p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors">
            <Calculator className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {payrolls.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelectedPayroll(p)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPayroll?.id === p.id 
                ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-[1.02]' 
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-lg">{p.period}</span>
                {getStatusBadge(p.status)}
              </div>
              <p className={`text-sm mb-3 ${selectedPayroll?.id === p.id ? 'text-slate-300' : 'text-slate-500'}`}>
                {p.projectName}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1"><UsersIcon className="w-4 h-4" /> {p.employeeCount} Pegawai</span>
                <span className="font-semibold">{formatCurrency(p.totalAmount)}</span>
              </div>
            </div>
          ))}
          {payrolls.length === 0 && (
            <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Belum ada data Payroll.
            </div>
          )}
        </div>
      </div>

      {/* Main Content Detail Payroll */}
      <div className="w-2/3">
        {selectedPayroll ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            
            {/* Header Detail */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Rincian Gaji Periode {selectedPayroll.period}</h2>
                <p className="text-slate-500 text-sm">Proyek: {selectedPayroll.projectName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500 mb-1">Total Tagihan Payroll</p>
                <p className="text-3xl font-bold text-slate-800">{formatCurrency(selectedPayroll.totalAmount)}</p>
              </div>
            </div>

            {/* Approval Flow Tracker */}
            <div className="p-6 border-b border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Status Approval</h3>
              <div className="flex items-center justify-between relative">
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0 rounded-full"></div>
                
                {/* Step 1: Draft/Submit */}
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedPayroll.status !== 'DRAFT' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Draft</span>
                </div>

                {/* Step 2: HRD */}
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${(selectedPayroll.status === 'HRD_APPROVED' || selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">HRD</span>
                </div>

                {/* Step 3: Finance */}
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${(selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Finance</span>
                </div>

                {/* Step 4: Dirut */}
                <div className="flex flex-col items-center z-10 gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedPayroll.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Top Mgmt</span>
                </div>
              </div>
            </div>

            {/* List Karyawan */}
            <div className="flex-1 overflow-y-auto p-0">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-semibold">PEGAWAI</th>
                    <th className="px-6 py-4 font-semibold">KEHADIRAN</th>
                    <th className="px-6 py-4 font-semibold">GAJI POKOK</th>
                    <th className="px-6 py-4 font-semibold">LEMBUR/TUNJ.</th>
                    <th className="px-6 py-4 font-semibold text-right">TAKE HOME PAY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedPayroll.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{item.employeeName}</p>
                        <p className="text-xs text-slate-500">{item.position}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-800">{item.workDays} Hari</p>
                        {item.overtime > 0 && <p className="text-xs text-amber-600">{item.overtime} Jam Lembur</p>}
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-medium">{formatCurrency(item.baseSalary)}</td>
                      <td className="px-6 py-4">
                        {item.allowances > 0 && <p className="text-emerald-600 text-xs">+ {formatCurrency(item.allowances)} (Tunjangan)</p>}
                        {item.overtimePay > 0 && <p className="text-emerald-600 text-xs">+ {formatCurrency(item.overtimePay)} (Lembur)</p>}
                        {item.deductions > 0 && <p className="text-rose-600 text-xs">- {formatCurrency(item.deductions)} (Potongan)</p>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-emerald-700">{formatCurrency(item.netSalary)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <p className="text-sm text-slate-500">
                Data ditarik otomatis dari input absensi PJO.
              </p>
              
              <div className="flex gap-3">
                {selectedPayroll.status === 'DRAFT' && (
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                    Submit ke HRD <ArrowRightCircle className="w-4 h-4" />
                  </button>
                )}
                {selectedPayroll.status === 'HRD_APPROVED' && (
                  <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                    Approve (Finance) <ArrowRightCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center border border-slate-200 rounded-xl bg-slate-50 border-dashed">
            <div className="text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600">Pilih Data Payroll</h3>
              <p className="text-slate-400 text-sm mt-1">Pilih periode payroll di samping untuk melihat rincian.</p>
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
