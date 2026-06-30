'use client';

import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children, title, subtitle, user }) {
  return (
    <div className="app-layout">
      <Sidebar user={user} />
      <div className="main-content">
        <Header title={title} subtitle={subtitle} user={user} />
        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
}
