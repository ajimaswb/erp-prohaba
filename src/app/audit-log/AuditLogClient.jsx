'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  History, Search, Filter, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, Eye
} from 'lucide-react'

export default function AuditLogClient() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const [selectedLog, setSelectedLog] = useState(null)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        page,
        limit: 20
      })
      if (search) query.append('search', search)
      if (moduleFilter) query.append('module', moduleFilter)
      if (actionFilter) query.append('action', actionFilter)

      const res = await fetch(`/api/audit-log?${query}`)
      const data = await res.json()
      
      if (res.ok) {
        setLogs(data.logs)
        setTotalPages(data.pagination.totalPages)
      } else {
        console.error('Error fetching logs:', data.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Refetch when filters or page change
  useEffect(() => {
    fetchLogs()
  }, [page, moduleFilter, actionFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchLogs()
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const getActionColor = (action) => {
    switch(action) {
      case 'CREATE': return 'var(--green-600)'
      case 'UPDATE': return 'var(--blue-600)'
      case 'DELETE': return 'var(--red-600)'
      case 'APPROVE': return 'var(--emerald-600)'
      case 'REJECT': return 'var(--orange-600)'
      default: return 'var(--gray-600)'
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama pengguna..." 
              className="form-input pl-10 w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="form-input w-40"
            value={moduleFilter}
            onChange={e => setModuleFilter(e.target.value)}
          >
            <option value="">Semua Modul</option>
            <option value="USERS">Users</option>
            <option value="PROJECTS">Proyek</option>
            <option value="HR">HR / Absensi</option>
            <option value="PAYROLL">Payroll</option>
            <option value="FINANCE">Keuangan / AP</option>
            <option value="PROCUREMENT">Procurement</option>
            <option value="WORKSHOP">Workshop</option>
          </select>
          
          <select 
            className="form-input w-40"
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
          >
            <option value="">Semua Aksi</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="APPROVE">APPROVE</option>
            <option value="REJECT">REJECT</option>
          </select>
        </div>
        
        <button 
          className="btn btn-outline flex items-center gap-2"
          onClick={() => { setPage(1); fetchLogs(); }}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Main Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal & Waktu</th>
                <th>Pengguna</th>
                <th>Modul</th>
                <th>Aksi</th>
                <th>Record ID</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                    Memuat data audit log...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    <History size={24} className="mx-auto mb-2 opacity-50" />
                    Tidak ada riwayat aktivitas ditemukan.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id}>
                    <td className="text-sm">
                      <div className="font-medium text-slate-800">
                        {new Date(log.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {new Date(log.createdAt).toLocaleTimeString('id-ID')}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-800">{log.user?.name || 'Unknown User'}</div>
                      <div className="text-xs text-slate-500 bg-slate-100 w-fit px-2 py-0.5 rounded-full mt-1">
                        {log.user?.role || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className="font-medium text-slate-700">{log.module}</span>
                    </td>
                    <td>
                      <span 
                        className="font-bold text-xs px-2.5 py-1 rounded-md"
                        style={{ 
                          backgroundColor: `${getActionColor(log.action)}15`,
                          color: getActionColor(log.action),
                          border: `1px solid ${getActionColor(log.action)}30`
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-slate-500">
                      {log.recordId}
                    </td>
                    <td>
                      <button 
                        className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                        onClick={() => setSelectedLog(log)}
                        title="Lihat Detail JSON"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50">
            <span className="text-sm text-slate-500 font-medium">Halaman {page} dari {totalPages}</span>
            <div className="flex gap-2">
              <button 
                className="btn btn-outline"
                style={{ padding: '6px 12px' }}
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="btn btn-outline"
                style={{ padding: '6px 12px' }}
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail JSON */}
      <AnimatePresence>
        {selectedLog && (
          <div className="modal-backdrop">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
              style={{ maxWidth: '800px', width: '100%' }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Detail Aktivitas</h3>
                  <p className="text-sm text-slate-500">ID: <span className="font-mono">{selectedLog.id}</span></p>
                </div>
                <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-slate-500 mb-1">Pengguna</div>
                  <div className="font-semibold">{selectedLog.user?.name} ({selectedLog.user?.role})</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-slate-500 mb-1">Aksi & Modul</div>
                  <div className="font-semibold">{selectedLog.action} - {selectedLog.module}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div> Old Value
                  </div>
                  <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap" style={{ maxHeight: '400px' }}>
                    {selectedLog.oldValue ? JSON.stringify(JSON.parse(selectedLog.oldValue), null, 2) : 'null'}
                  </pre>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> New Value
                  </div>
                  <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap" style={{ maxHeight: '400px' }}>
                    {selectedLog.newValue ? JSON.stringify(JSON.parse(selectedLog.newValue), null, 2) : 'null'}
                  </pre>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="btn btn-outline" onClick={() => setSelectedLog(null)}>Tutup</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
