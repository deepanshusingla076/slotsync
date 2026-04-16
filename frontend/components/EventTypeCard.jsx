'use client';
/**
 * EventTypeCard Component
 * Displays a summary of an event type with a clean, professional card design.
 */

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';

export default function EventTypeCard({ event, origin, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `${origin || window.location.origin}/book/${event.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card flex flex-col h-full relative overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

      {/* Accent color stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200"
        style={{ backgroundColor: event.color || '#0066FF' }}
      />

      <div className="p-5 pl-6 flex-1 flex flex-col relative w-full">
        <div className="flex justify-between items-start mb-3">
           <h3 className="text-[16px] font-bold text-gray-900 leading-snug">
             {event.title}
           </h3>
           <Menu as="div" className="relative inline-block text-left">
             <Menu.Button className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer outline-none p-1 rounded-md hover:bg-gray-100">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>
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
               <Menu.Items className="absolute right-0 mt-1 w-36 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                 <div className="px-1 py-1">
                   <Menu.Item>
                     {({ active }) => (
                       <button onClick={onEdit} className={`${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'} group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium`}>
                          Edit
                       </button>
                     )}
                   </Menu.Item>
                   {event.is_active && (
                     <Menu.Item>
                       {({ active }) => (
                         <Link href={`/book/${event.slug}`} target="_blank" className={`${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'} group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium`}>
                            Preview
                         </Link>
                       )}
                     </Menu.Item>
                   )}
                 </div>
                 <div className="px-1 py-1">
                   <Menu.Item>
                     {({ active }) => (
                       <button onClick={onDelete} className={`${active ? 'bg-red-50 text-red-600' : 'text-red-500'} group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium`}>
                          Delete
                       </button>
                     )}
                   </Menu.Item>
                 </div>
               </Menu.Items>
             </Transition>
           </Menu>
        </div>

        <div className="flex items-center gap-2 mb-4">
           <div className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
             {event.duration_minutes} min
           </div>
           {/* Placeholder for buffer if we had it */}
           <div className="px-2 py-0.5 bg-blue-50 text-blue-500 text-xs font-semibold rounded-md hidden">
             +15m buffer
           </div>
        </div>

        <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-xs font-medium text-[#0066FF] hover:underline mb-3 w-fit"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          {event.slug ? `default_user/${event.slug}` : `default_user/meeting`}
        </button>

        {event.description && (
          <p className="text-sm text-gray-600 line-clamp-2 flex-1 leading-relaxed">
            {event.description}
          </p>
        )}

      </div>
    </div>
  );
}
