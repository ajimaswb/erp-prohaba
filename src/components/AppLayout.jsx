'use client';

import Sidebar from './Sidebar';
import Header from './Header';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLayout({ children, title, subtitle, user }) {
  const pathname = usePathname();
  return (
    <div className="app-layout">
      <Sidebar user={user} />
      <div className="main-content">
        <Header title={title} subtitle={subtitle} user={user} />
        <main className="page-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
