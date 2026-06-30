'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">P</div>
          <div className="login-company">PT. PROHABA JAYA MANDIRI</div>
          <div className="login-subtitle">Sistem ERP Konstruksi Pertambangan</div>
        </div>

        {/* Form */}
        <div className="login-title">Selamat Datang</div>
        <div className="login-desc">Masuk ke akun Anda untuk melanjutkan</div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="nama@prohaba.co.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                Memproses...
              </>
            ) : (
              <>
                Masuk ke Sistem
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <div style={{
          marginTop: 24, padding: '12px 14px',
          background: 'var(--navy-50)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--navy-100)',
        }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--navy-700)', marginBottom: 6 }}>
            🔑 Akun Demo
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--gray-600)', lineHeight: 1.8 }}>
            <div><strong>Top Mgmt:</strong> admin@prohaba.co.id / admin123</div>
            <div><strong>Finance:</strong> finance@prohaba.co.id / finance123</div>
            <div><strong>PJO:</strong> pjo@prohaba.co.id / pjo123</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--gray-400)' }}>
          © 2024 PT. Prohaba Jaya Mandiri — ERP v1.0
        </div>
      </div>
    </div>
  );
}
