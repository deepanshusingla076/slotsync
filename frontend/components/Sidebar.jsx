'use client';
/**
 * Sidebar Component
 * Provides navigation links and user interface controls for the dashboard layout.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MAIN_NAV = [
  {
    href: '/dashboard',
    label: 'Scheduling',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    href: '/meetings',
    label: 'Meetings',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    href: '/availability',
    label: 'Availability',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  }
];

const BOTTOM_NAV = [
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
  }
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-full md:w-[250px] flex-shrink-0 bg-white border-t md:border-t-0 md:border-r border-slate-200 flex flex-row md:flex-col fixed bottom-0 left-0 md:relative z-20 h-16 md:h-full">

      <div className="hidden md:flex justify-between items-center px-6 py-5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[#0066FF] font-bold text-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2.5">
               <rect x="3" y="4" width="18" height="18" rx="2" />
               <path d="M3 10h18M8 2v4M16 2v4" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0066FF]">SlotSync</span>
        </Link>
      </div>

      <div className="hidden md:block px-4 mb-2">
         <Link href="/dashboard?create=true" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            Create
         </Link>
      </div>

      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start items-center md:items-stretch overflow-y-auto px-2 md:px-3 py-0 md:py-1 space-y-0 md:space-y-[4px] overflow-x-auto w-full">
        {MAIN_NAV.map(l => {
          const active = path === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-3 md:py-2.5 md:rounded-xl text-xs md:text-[14px] font-medium transition-all duration-200 whitespace-nowrap ${
                active
                  ? 'text-[#0066FF] md:bg-[#EBF3FF] border-t-2 border-blue-500 md:border-none'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-t-2 border-transparent md:border-none'
              }`}
            >
              <span className={`hidden md:block transition-colors ${active ? 'text-[#0066FF]' : 'text-gray-500'}`}>
                {l.icon}
              </span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block px-3 py-4 border-t border-gray-100 space-y-[2px]">
        {BOTTOM_NAV.map(l => (
           <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              <span className="text-gray-500">
                {l.icon}
              </span>
              {l.label}
            </Link>
        ))}
      </div>
    </aside>
  );
}
