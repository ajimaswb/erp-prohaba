'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogIn, Building, ShieldAlert } from 'lucide-react'

export default function LoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    if (res?.error) {
      setError('Email atau password salah.')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh() // Refresh to update server components with session
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)',
      padding: '24px'
    }}>
      {/* Background Ornaments */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, rgba(255,255,255,0) 70%)' }}></div>
      </div>

      <div className="card" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '40px',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)'
          }}>
            <Building style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--gray-900)' }}>ERP Prohaba</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '14px', marginTop: '8px' }}>Login untuk mengakses sistem</p>
        </div>

        {error && (
          <div style={{ background: 'var(--red-50)', border: '1px solid var(--red-200)', color: 'var(--red-700)', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 500 }}>
            <ShieldAlert style={{ width: '20px', height: '20px' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="nama@prohaba.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ padding: '12px 16px', fontSize: '15px' }}
            />
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
            </div>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ padding: '12px 16px', fontSize: '15px' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: '15px', 
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
            disabled={loading}
          >
            {loading ? (
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
            ) : (
              <>
                <LogIn style={{ width: '20px', height: '20px' }} /> 
                Masuk ke Sistem
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
            &copy; {new Date().getFullYear()} PT. Prohaba Jaya Mandiri. All rights reserved.
          </p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  )
}
