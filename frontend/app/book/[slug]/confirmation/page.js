'use client';
// Booking Confirmation — Professional Revert

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ConfirmationContent() {
  const params = useSearchParams();
  
  const name     = params.get('name');
  const event    = params.get('event');
  const date     = params.get('date');
  const time     = params.get('time');
  const duration = params.get('duration');

  const fmtTime = (t) => {
    if (!t) return '';
    return new Date(`2000-01-01T${t}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  const fmtDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const endStr = time && duration 
    ? fmtTime(new Date(new Date(`2000-01-01T${time}`).getTime() + duration*60000).toTimeString().substring(0,5))
    : '';

  return (
    <div className="bg-white rounded-xl shadow-xl shadow-gray-200/40 border border-gray-200 w-full max-w-[800px] text-center px-6 py-12 md:py-16 mx-4">
      
      {/* Avatars */}
      <div className="flex justify-center flex-col items-center gap-4 mb-6">
        <div className="flex -space-x-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#006BFF] to-[#0052CC] flex items-center justify-center text-white text-lg font-bold border-2 border-white shadow-sm z-10">
            D
          </div>
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-bold border-2 border-white shadow-sm z-0">
            {name ? name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 font-bold text-sm rounded-full">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          You are scheduled
        </div>
      </div>

      <p className="text-gray-500 mb-2">A calendar invitation has been sent to your email address.</p>

      {/* Card */}
      <div className="max-w-md mx-auto text-left bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8 mb-10">
        <h2 className="text-[17px] font-bold text-gray-900 mb-5">{event}</h2>
        
        <div className="space-y-4 text-sm font-semibold text-gray-500">
          <div className="flex items-start gap-3 text-gray-700">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <div>
               {fmtTime(time)} – {endStr}
              <br/>
              {fmtDate(date)}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l4.55 4.55a1 1 0 01-1.41 1.41L13.6 11.41a1 1 0 011.41-1.41z"/><rect x="4" y="6" width="10" height="12" rx="2"/></svg>
            Web conferencing details to follow
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-center gap-8 text-sm font-bold">
        <Link href="/" className="text-[#006BFF] hover:underline">Powered by SlotSync</Link>
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors">Admin Dashboard</Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="spinner-blue" />}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
