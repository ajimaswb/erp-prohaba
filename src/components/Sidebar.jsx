'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, LineChart, Ruler,
  Wrench, Package, ShoppingCart, ShoppingBag,
  DollarSign, Banknote, Users, Calendar,
  CreditCard, UserCog, History
} from 'lucide-react';


const ROLE_LABELS = {
  TOP_MANAGEMENT: 'Top Management',
  HRD: 'HRD',
  PJO: 'P.J. Operasional',
  LOGISTIK: 'Logistik & Procurement',
  FINANCE: 'Finance',
  ENGINEERING: 'Engineering',
  WORKSHOP: 'Workshop',
};

const NAV_ITEMS = [
  {
    section: 'Utama',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ALL'] },
      { href: '/projects', label: 'Proyek', icon: Building2, roles: ['ALL'] },
    ],
  },
  {
    section: 'Operasional',
    items: [
      { href: '/scurve', label: 'S-Curve & Progress', icon: LineChart, roles: ['TOP_MANAGEMENT', 'PJO', 'FINANCE', 'ENGINEERING'] },
      { href: '/documents', label: 'Dokumen Engineering', icon: Ruler, roles: ['TOP_MANAGEMENT', 'ENGINEERING', 'PJO', 'WORKSHOP'] },
      { href: '/workshop', label: 'Workshop', icon: Wrench, roles: ['TOP_MANAGEMENT', 'ENGINEERING', 'WORKSHOP', 'PJO'] },
      { href: '/material-request', label: 'Material Request', icon: Package, roles: ['TOP_MANAGEMENT', 'PJO', 'LOGISTIK'] },
      { href: '/procurement', label: 'Procurement & PO', icon: ShoppingCart, roles: ['TOP_MANAGEMENT', 'LOGISTIK', 'FINANCE'] },
      { href: '/site-purchase', label: 'Pembelian Site', icon: ShoppingBag, roles: ['TOP_MANAGEMENT', 'PJO', 'LOGISTIK', 'FINANCE'] },
    ],
  },
  {
    section: 'Keuangan',
    items: [
      { href: '/finance', label: 'Keuangan & AP', icon: DollarSign, roles: ['TOP_MANAGEMENT', 'FINANCE'] },
      { href: '/revenue', label: 'Pendapatan', icon: Banknote, roles: ['TOP_MANAGEMENT', 'FINANCE'] },
    ],
  },
  {
    section: 'SDM',
    items: [
      { href: '/employees', label: 'Data Karyawan', icon: Users, roles: ['TOP_MANAGEMENT', 'HRD'] },
      { href: '/attendance', label: 'Absensi', icon: Calendar, roles: ['TOP_MANAGEMENT', 'HRD', 'PJO'] },
      { href: '/payroll', label: 'Payroll', icon: CreditCard, roles: ['TOP_MANAGEMENT', 'HRD', 'FINANCE'] },
    ],
  },
  {
    section: 'Sistem',
    items: [
      { href: '/users', label: 'Pengguna', icon: UserCog, roles: ['TOP_MANAGEMENT'] },
      { href: '/audit-log', label: 'Audit Log', icon: History, roles: ['TOP_MANAGEMENT'] },
    ],
  },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const userRole = user?.role || 'TOP_MANAGEMENT';

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const hasAccess = (roles) => roles.includes('ALL') || roles.includes(userRole);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          <div className="sidebar-logo-icon">P</div>
          <div className="sidebar-logo-text">
            <div className="sidebar-logo-name">Prohaba Jaya Mandiri</div>
            <div className="sidebar-logo-sub">Sistem ERP Konstruksi</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((section) => {
          const visibleItems = section.items.filter(item => hasAccess(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.section} className="nav-section">
              <div className="nav-section-label">{section.section}</div>
              {visibleItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} className="nav-icon" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Pengguna'}</div>
            <div className="user-role">{ROLE_LABELS[userRole] || userRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
