'use client';
// components/Sidebar.jsx
// ------------------------------------------------
// Persistent left navigation used by all dashboard
// pages. usePathname() highlights the active link.
// ------------------------------------------------

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ── Icons (inline SVGs — no dependency needed) ──
const CalendarIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const navItems = [
  { href: '/dashboard',    label: 'Event Types', icon: <CalendarIcon /> },
  { href: '/availability', label: 'Availability', icon: <ClockIcon /> },
  { href: '/meetings',     label: 'Meetings',     icon: <UsersIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">

      {/* ── Logo ─────────────────────────────── */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-lg tracking-tight">SlotSync</span>
        </Link>
      </div>

      {/* ── Navigation ───────────────────────── */}
      <nav className="flex-1 p-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── User Footer ──────────────────────── */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">U</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Default User</p>
            <p className="text-xs text-gray-400 truncate">slotsync.local</p>
          </div>
        </div>
      </div>

    </aside>
  );
}
