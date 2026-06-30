'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header({ title, subtitle, user }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="header">
      <div className="header-breadcrumb">
        <div className="header-title">{title}</div>
        {subtitle && <div className="header-subtitle">{subtitle}</div>}
      </div>

      <div className="header-actions">
        {/* Notifications */}
        <button className="header-btn" title="Notifikasi">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notification-dot"></span>
        </button>

        {/* Date/Time */}
        <div style={{ fontSize: '12px', color: 'var(--gray-500)', padding: '0 8px', borderLeft: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)', lineHeight: 1.4, textAlign: 'right' }}>
          <div style={{ fontWeight: 600, color: 'var(--gray-700)' }}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
          <div>{new Date().getFullYear()}</div>
        </div>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            className="header-btn"
            style={{ width: 'auto', padding: '6px 10px', gap: 8, display: 'flex', alignItems: 'center' }}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--navy-600), var(--orange-500))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {showUserMenu && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                onClick={() => setShowUserMenu(false)}
              />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                background: 'white', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-lg)',
                minWidth: 200, zIndex: 100, overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-900)' }}>{user?.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--gray-500)' }}>{user?.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%', padding: '10px 16px', textAlign: 'left',
                    fontSize: 13.5, color: 'var(--red-600)', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'background var(--transition-fast)',
                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--red-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
