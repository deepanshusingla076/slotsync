'use client';
// Sidebar — Calendly-faithful left navigation

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ── Icons ──────────────────────────────────────── */
const GridIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const NAV = [
  { href: '/dashboard',    label: 'Event Types',      Icon: GridIcon },
  { href: '/availability', label: 'Availability',      Icon: CalendarIcon },
  { href: '/meetings',     label: 'Scheduled Events',  Icon: ClockIcon },
];

function NavItem({ href, label, Icon, isActive }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        isActive
          ? 'bg-[#EBF2FF] text-[#006BFF]'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <span className={isActive ? 'text-[#006BFF]' : 'text-gray-400'}>
        <Icon />
      </span>
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 flex-shrink-0 group"
      >
        <div className="w-8 h-8 bg-[#006BFF] rounded-[10px] flex items-center justify-center shadow-sm group-hover:bg-[#0052CC] transition-colors">
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        </div>
        <span className="font-bold text-gray-900 text-[17px] tracking-tight">SlotSync</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            Icon={item.Icon}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Divider + Home link */}
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <span className="text-gray-400"><HomeIcon /></span>
          Home
        </Link>
      </div>

      {/* User footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006BFF] to-[#0052CC] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
            D
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">Default User</p>
            <p className="text-xs text-gray-400 truncate">Free Plan</p>
          </div>
        </div>
      </div>

    </aside>
  );
}
