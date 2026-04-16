'use client';
/**
 * Sidebar Component
 * Provides navigation links and user interface controls for the dashboard layout.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const path = usePathname();

  const links = [
    { href: '/dashboard', label: 'Event Types' },
    { href: '/availability', label: 'Availability' },
    { href: '/meetings', label: 'Scheduled Events' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">

      <Link href="/" className="flex items-center gap-2 p-6 flex-shrink-0">
        <div className="w-8 h-8 bg-[#006BFF] rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
          S
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900">SlotSync</span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {links.map(l => {
          const active = path === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                active 
                  ? 'bg-blue-50 text-[#006BFF]' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
            D
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Default User</p>
            <p className="text-xs text-gray-500 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
