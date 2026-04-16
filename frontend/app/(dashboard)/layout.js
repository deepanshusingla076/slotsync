// app/(dashboard)/layout.js
// ------------------------------------------------
// The (dashboard) route group adds a persistent
// sidebar to all internal pages: /dashboard,
// /availability, /meetings.
//
// The () in folder name means it doesn't affect
// the URL — just groups the layout.
// ------------------------------------------------

import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
