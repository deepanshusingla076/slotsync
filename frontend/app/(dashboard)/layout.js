'use client';
/**
 * Dashboard Layout
 * Wraps the dashboard pages with the Sidebar navigation.
 * Excludes the landing page to provide a full-width experience.
 */

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuNotice, setMenuNotice] = useState('');

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const handleShareDashboard = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/dashboard`);
      setMenuNotice('Dashboard link copied');
      setTimeout(() => setMenuNotice(''), 2200);
    } catch {
      setMenuNotice('Could not copy link');
      setTimeout(() => setMenuNotice(''), 2200);
    }
  };

  // Landing page gets full-width, no sidebar
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-[100dvh] md:h-screen bg-[#F9FAFB] overflow-x-hidden md:overflow-hidden flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="md:hidden h-14 bg-white flex items-center justify-between px-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 text-[#0066FF] font-bold text-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 10.5 12 3l9 7.5"/>
              <path d="M5 9.5V21h14V9.5"/>
            </svg>
            Home
          </Link>
          <span className="text-sm font-semibold text-gray-500">Dashboard</span>
        </header>
        <header className="hidden md:flex h-16 bg-white border-b border-slate-100 items-center justify-between px-6 flex-shrink-0 gap-4 z-20 relative">
           {menuNotice && (
             <div className="absolute left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-semibold text-[#0066FF] bg-blue-50 border border-blue-100 rounded-md animate-fade-in">
               {menuNotice}
             </div>
           )}
          <div className="text-sm font-semibold text-slate-700">Dashboard Workspace</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareDashboard}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Share link
            </button>
            <button
              onClick={handleOpenSettings}
              className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Settings
            </button>
          </div>
        </header>
        <main
          className="flex-1 min-h-0 overflow-y-auto pb-16 md:pb-0 md:overscroll-y-contain"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
