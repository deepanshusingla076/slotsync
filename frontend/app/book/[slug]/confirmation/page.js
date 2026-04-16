'use client';
/**
 * Booking Confirmation Page
 * Displays the details of a successfully scheduled meeting to the user.
 */

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
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/30 border border-gray-100 w-full max-w-[720px] text-center px-8 py-14 md:py-16 mx-4 animate-fade-in-up">
      
      {/* Avatars */}
      <div className="flex justify-center flex-col items-center gap-5 mb-8">
        <div className="flex -space-x-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#4F46E5] flex items-center justify-center text-white text-lg font-bold border-2 border-white shadow-md z-10">
            D
          </div>
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-bold border-2 border-white shadow-sm z-0">
            {name ? name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-full border border-emerald-100">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          You are scheduled
        </div>
      </div>

      <p className="text-gray-400 mb-2 text-[15px]">A calendar invitation has been sent to your email address.</p>

      {/* Details Card */}
      <div className="max-w-md mx-auto text-left bg-gray-50/70 border border-gray-100 rounded-2xl p-6 mt-8 mb-10">
        <h2 className="text-base font-bold text-gray-900 mb-5">{event}</h2>
        
        <div className="space-y-4 text-sm font-semibold text-gray-500">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
               {fmtTime(time)} – {endStr}
              <br/>
              <span className="text-gray-400 font-medium">{fmtDate(date)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l4.55 4.55a1 1 0 01-1.41 1.41L13.6 11.41a1 1 0 011.41-1.41z"/><rect x="4" y="6" width="10" height="12" rx="2"/></svg>
            </div>
            <span className="text-gray-400 font-medium">Web conferencing details to follow</span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-50 flex justify-center gap-8 text-sm font-bold">
        <Link href="/" className="text-[#0066FF] hover:underline">Powered by SlotSync</Link>
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-900 transition-colors">Admin Dashboard</Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="spinner-blue" />}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
