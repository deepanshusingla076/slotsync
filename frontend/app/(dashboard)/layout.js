'use client';
/**
 * Dashboard Layout
 * Wraps the dashboard pages with the Sidebar navigation.
 * Excludes the landing page to provide a full-width experience.
 */

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Landing page gets full-width, no sidebar
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 text-[#0066FF] font-bold text-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 10.5 12 3l9 7.5"/>
              <path d="M5 9.5V21h14V9.5"/>
            </svg>
            Home
          </Link>
          <span className="text-sm font-semibold text-gray-500">Dashboard</span>
        </header>
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-end px-6 flex-shrink-0 gap-6 z-20 relative">
           <button className="text-gray-500 hover:text-gray-700 transition-colors">
             <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
               <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
               <circle cx="8.5" cy="7" r="4"/>
               <line x1="20" y1="8" x2="20" y2="14"/>
               <line x1="23" y1="11" x2="17" y2="11"/>
             </svg>
           </button>

           <Menu as="div" className="relative inline-block text-left">
             <Menu.Button className="flex items-center gap-2.5 text-gray-500 hover:text-gray-700 transition-colors outline-none focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center text-white shadow-sm ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
             </Menu.Button>
             <Transition
               as={Fragment}
               enter="transition ease-out duration-100"
               enterFrom="transform opacity-0 scale-95"
               enterTo="transform opacity-100 scale-100"
               leave="transition ease-in duration-75"
               leaveFrom="transform opacity-100 scale-100"
               leaveTo="transform opacity-0 scale-95"
             >
               <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                 <div className="px-3 py-2.5">
                   <div className="flex items-center gap-2.5">
                     <div className="w-7 h-7 rounded-full bg-[#0066FF] flex items-center justify-center text-white shadow-sm">
                       <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                         <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                         <circle cx="12" cy="7" r="4"/>
                       </svg>
                     </div>
                     <div>
                       <p className="text-xs font-semibold text-gray-900">Default Account</p>
                       <p className="text-[11px] text-gray-400">Admin</p>
                     </div>
                   </div>
                 </div>
                 <div className="px-1 py-1">
                   <Menu.Item>
                     {({ active }) => (
                       <button className={`${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'} group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium`}>
                          Settings
                       </button>
                     )}
                   </Menu.Item>
                   <Menu.Item>
                     {({ active }) => (
                       <button className={`${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'} group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium`}>
                          Share link
                       </button>
                     )}
                   </Menu.Item>
                 </div>
                 <div className="px-1 py-1">
                   <Menu.Item>
                     {({ active }) => (
                       <button className={`${active ? 'bg-red-50 text-red-600' : 'text-red-500'} group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium`}>
                          Logout
                       </button>
                     )}
                   </Menu.Item>
                 </div>
               </Menu.Items>
             </Transition>
           </Menu>
        </header>
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
