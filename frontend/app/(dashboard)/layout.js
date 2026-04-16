'use client';
// app/(dashboard)/layout.js
// Shows sidebar only on internal pages, not on the landing page (/)

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Landing page gets full-width, no sidebar
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
