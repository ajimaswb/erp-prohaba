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
      case 'DRAFT': return <span className="badge badge-gray">DRAFT</span>
      case 'SUBMITTED': return <span className="badge badge-info">Menunggu HRD</span>
      case 'HRD_APPROVED': return <span className="badge badge-warning">Menunggu Finance</span>
      case 'FINANCE_APPROVED': return <span className="badge badge-navy">Menunggu Direktur</span>
      case 'PAID': return <span className="badge badge-success">Dibayar</span>
      default: return <span className="badge badge-gray">{status}</span>
    }
  }

  return (
    <div className="page-container" style={{ display: 'flex', gap: '24px', flexDirection: 'row', alignItems: 'flex-start' }}>
      
      {/* Sidebar List Payroll */}
      <div style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--gray-900)' }}>Payroll</h1>
            <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '4px' }}>Proses & Approval Gaji</p>
          </div>
          <button className="btn btn-orange" style={{ padding: '10px', borderRadius: '12px' }}>
            <Calculator className="btn-icon" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {payrolls.map((p) => {
            const isSelected = selectedPayroll?.id === p.id;
            return (
              <div 
                key={p.id}
                onClick={() => setSelectedPayroll(p)}
                className="card"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  border: isSelected ? '2px solid var(--navy-500)' : '1px solid var(--gray-200)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  background: isSelected ? 'var(--navy-50)' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 700, fontSize: '16px', color: isSelected ? 'var(--navy-800)' : 'var(--gray-800)' }}>{p.period}</span>
                  {getStatusBadge(p.status)}
                </div>
                <p style={{ fontSize: '13.5px', marginBottom: '16px', fontWeight: 500, color: isSelected ? 'var(--navy-600)' : 'var(--gray-600)' }}>
                  {p.projectName}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderTop: '1px solid var(--gray-200)', paddingTop: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray-500)', fontWeight: 500 }}>
                    <UsersIcon style={{ width: '16px', height: '16px' }} /> {p.employeeCount} Pegawai
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{formatCurrency(p.totalAmount)}</span>
                </div>
              </div>
            )
          })}
          {payrolls.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '32px', border: '1px dashed var(--gray-300)', background: 'var(--gray-50)' }}>
              <FileText style={{ width: '32px', height: '32px', margin: '0 auto 12px', color: 'var(--gray-400)' }} />
              <p style={{ fontWeight: 500, color: 'var(--gray-500)' }}>Belum ada data Payroll.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Detail Payroll */}
      <div style={{ flex: '1', minWidth: 0 }}>
        {selectedPayroll ? (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}>
            
            {/* Header Detail */}
            <div className="card-header" style={{ padding: '24px', background: 'var(--gray-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gray-900)', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>Rincian Gaji Periode {selectedPayroll.period}</h2>
                <p style={{ fontSize: '14px', color: 'var(--gray-600)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--navy-500)' }}></span>
                  Proyek: {selectedPayroll.projectName}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Tagihan Payroll</p>
                <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy-900)', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
                  {formatCurrency(selectedPayroll.totalAmount)}
                </p>
              </div>
            </div>

            {/* Approval Flow Tracker */}
            <div style={{ padding: '32px 48px', borderBottom: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                {/* Progress Bar Background */}
                <div style={{ position: 'absolute', left: '24px', right: '24px', top: '50%', transform: 'translateY(-50%)', height: '6px', background: 'var(--gray-100)', borderRadius: '999px', overflow: 'hidden', zIndex: 0 }}>
                  <div style={{ 
                    height: '100%', 
                    background: 'linear-gradient(90deg, var(--green-500), var(--green-400))', 
                    transition: 'width 1s ease-in-out',
                    width: 
                      selectedPayroll.status === 'DRAFT' ? '0%' :
                      selectedPayroll.status === 'SUBMITTED' ? '33%' :
                      selectedPayroll.status === 'HRD_APPROVED' ? '66%' :
                      selectedPayroll.status === 'FINANCE_APPROVED' ? '100%' :
                      selectedPayroll.status === 'PAID' ? '100%' : '0%'
                  }}></div>
                </div>
                
                {/* Step 1: Draft/Submit */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 10 }}>
                  <div style={{ 
                    width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
                    background: selectedPayroll.status !== 'DRAFT' ? 'linear-gradient(135deg, var(--green-500), var(--green-600))' : 'white',
                    color: selectedPayroll.status !== 'DRAFT' ? 'white' : 'var(--gray-400)',
                    border: selectedPayroll.status !== 'DRAFT' ? 'none' : '1px solid var(--gray-200)',
                    boxShadow: selectedPayroll.status !== 'DRAFT' ? '0 8px 16px rgba(34,197,94,0.25)' : 'var(--shadow-sm)'
                  }}>
                    <FileText style={{ width: '24px', height: '24px' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: selectedPayroll.status !== 'DRAFT' ? 'var(--green-600)' : 'var(--gray-500)' }}>Draft</span>
                </div>

                {/* Step 2: HRD */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 10 }}>
                  <div style={{ 
                    width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
                    background: (selectedPayroll.status === 'HRD_APPROVED' || selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? 'linear-gradient(135deg, var(--green-500), var(--green-600))' : (selectedPayroll.status === 'SUBMITTED' ? 'white' : 'white'),
                    color: (selectedPayroll.status === 'HRD_APPROVED' || selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? 'white' : (selectedPayroll.status === 'SUBMITTED' ? 'var(--green-500)' : 'var(--gray-400)'),
                    border: (selectedPayroll.status === 'HRD_APPROVED' || selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? 'none' : (selectedPayroll.status === 'SUBMITTED' ? '2px solid var(--green-500)' : '1px solid var(--gray-200)'),
                    boxShadow: (selectedPayroll.status === 'HRD_APPROVED' || selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? '0 8px 16px rgba(34,197,94,0.25)' : (selectedPayroll.status === 'SUBMITTED' ? '0 4px 12px rgba(34,197,94,0.15)' : 'var(--shadow-sm)')
                  }}>
                    <CheckCircle style={{ width: '24px', height: '24px' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: (selectedPayroll.status === 'HRD_APPROVED' || selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? 'var(--green-600)' : (selectedPayroll.status === 'SUBMITTED' ? 'var(--green-600)' : 'var(--gray-500)') }}>HRD</span>
                </div>

                {/* Step 3: Finance */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 10 }}>
                  <div style={{ 
                    width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
                    background: (selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? 'linear-gradient(135deg, var(--green-500), var(--green-600))' : (selectedPayroll.status === 'HRD_APPROVED' ? 'white' : 'white'),
                    color: (selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? 'white' : (selectedPayroll.status === 'HRD_APPROVED' ? 'var(--green-500)' : 'var(--gray-400)'),
                    border: (selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? 'none' : (selectedPayroll.status === 'HRD_APPROVED' ? '2px solid var(--green-500)' : '1px solid var(--gray-200)'),
                    boxShadow: (selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? '0 8px 16px rgba(34,197,94,0.25)' : (selectedPayroll.status === 'HRD_APPROVED' ? '0 4px 12px rgba(34,197,94,0.15)' : 'var(--shadow-sm)')
                  }}>
                    <Wallet style={{ width: '24px', height: '24px' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: (selectedPayroll.status === 'FINANCE_APPROVED' || selectedPayroll.status === 'PAID') ? 'var(--green-600)' : (selectedPayroll.status === 'HRD_APPROVED' ? 'var(--green-600)' : 'var(--gray-500)') }}>Finance</span>
                </div>

                {/* Step 4: Dirut */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 10 }}>
                  <div style={{ 
                    width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
                    background: selectedPayroll.status === 'PAID' ? 'linear-gradient(135deg, var(--green-500), var(--green-600))' : (selectedPayroll.status === 'FINANCE_APPROVED' ? 'white' : 'white'),
                    color: selectedPayroll.status === 'PAID' ? 'white' : (selectedPayroll.status === 'FINANCE_APPROVED' ? 'var(--green-500)' : 'var(--gray-400)'),
                    border: selectedPayroll.status === 'PAID' ? 'none' : (selectedPayroll.status === 'FINANCE_APPROVED' ? '2px solid var(--green-500)' : '1px solid var(--gray-200)'),
                    boxShadow: selectedPayroll.status === 'PAID' ? '0 8px 16px rgba(34,197,94,0.25)' : (selectedPayroll.status === 'FINANCE_APPROVED' ? '0 4px 12px rgba(34,197,94,0.15)' : 'var(--shadow-sm)')
                  }}>
                    <DollarSign style={{ width: '24px', height: '24px' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: selectedPayroll.status === 'PAID' ? 'var(--green-600)' : (selectedPayroll.status === 'FINANCE_APPROVED' ? 'var(--green-600)' : 'var(--gray-500)') }}>Top Mgmt</span>
                </div>
              </div>
            </div>

            {/* List Karyawan */}
            <div style={{ flex: '1', overflowY: 'auto', padding: 0 }}>
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--gray-50)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <tr>
                      <th>PEGAWAI</th>
                      <th>KEHADIRAN</th>
                      <th>GAJI POKOK</th>
                      <th>LEMBUR / TUNJ.</th>
                      <th style={{ textAlign: 'right' }}>TAKE HOME PAY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayroll.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--navy-50)', color: 'var(--navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', border: '1px solid var(--navy-100)' }}>
                              {getInitials(item.employeeName)}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{item.employeeName}</p>
                              <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>{item.position}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{item.workDays} Hari</p>
                          {item.overtime > 0 && (
                            <span className="badge badge-warning" style={{ marginTop: '6px' }}>
                              <Clock style={{ width: '12px', height: '12px' }} /> {item.overtime} Jam
                            </span>
                          )}
                        </td>
                        <td style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{formatCurrency(item.baseSalary)}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {item.allowances > 0 && <span className="badge badge-success" style={{ width: 'fit-content' }}>+ {formatCurrency(item.allowances)} <span style={{ opacity: 0.8, marginLeft: '4px', fontWeight: 500 }}>(Tunjangan)</span></span>}
                            {item.overtimePay > 0 && <span className="badge badge-success" style={{ width: 'fit-content' }}>+ {formatCurrency(item.overtimePay)} <span style={{ opacity: 0.8, marginLeft: '4px', fontWeight: 500 }}>(Lembur)</span></span>}
                            {item.deductions > 0 && <span className="badge badge-danger" style={{ width: 'fit-content' }}>- {formatCurrency(item.deductions)} <span style={{ opacity: 0.8, marginLeft: '4px', fontWeight: 500 }}>(Potongan)</span></span>}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 800, fontSize: '15px', color: 'var(--green-600)' }}>{formatCurrency(item.netSalary)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Bar */}
            <div className="card-footer" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gray-300)' }}></span>
                Data terintegrasi otomatis dari input absensi PJO.
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                {selectedPayroll.status === 'DRAFT' && (
                  <button className="btn btn-primary" style={{ padding: '12px 24px' }}>
                    Submit ke HRD <ArrowRightCircle className="btn-icon" />
                  </button>
                )}
                {selectedPayroll.status === 'HRD_APPROVED' && (
                  <button className="btn btn-primary" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, var(--green-600), var(--green-500))' }}>
                    Setujui (Finance) <ArrowRightCircle className="btn-icon" />
                  </button>
                )}
                {selectedPayroll.status === 'FINANCE_APPROVED' && (
                  <button className="btn" style={{ padding: '12px 24px', background: 'var(--gray-900)', color: 'white' }}>
                    Setujui & Bayar (Direktur) <ArrowRightCircle className="btn-icon" />
                  </button>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="card" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', border: '1px dashed var(--gray-300)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--gray-200)', margin: '0 auto 20px', boxShadow: 'var(--shadow-sm)' }}>
                <FileText style={{ width: '40px', height: '40px', color: 'var(--gray-400)' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gray-800)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Pilih Data Payroll</h3>
              <p style={{ fontSize: '14px', color: 'var(--gray-500)', maxWidth: '300px', margin: '0 auto', lineHeight: 1.6 }}>Pilih periode payroll di samping untuk melihat rincian kalkulasi gaji dan status persetujuan.</p>
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
