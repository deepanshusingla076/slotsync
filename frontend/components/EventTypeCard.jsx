'use client';
// EventTypeCard — Professional Revert

import { useState } from 'react';
import Link from 'next/link';

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
    <div className="card flex flex-col h-full relative overflow-hidden group hover:shadow-md transition-shadow">
      
      {/* Accent color stripe */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: event.color || '#006BFF' }}
      />

      <div className="p-5 pl-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          {!event.is_active && <span className="badge-gray">Off</span>}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {event.duration_minutes} min
          </div>
        </div>

        <h3 className="text-[17px] font-bold text-gray-900 mb-2 leading-snug">
          {event.title}
        </h3>
        
        {event.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
            {event.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <button 
            onClick={copyLink}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#006BFF] hover:text-[#0052CC] transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            {copied ? 'Copied!' : 'Copy link'}
          </button>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors" title="Edit">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button onClick={onDelete} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
            {event.is_active && (
              <Link href={`/book/${event.slug}`} target="_blank" className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </Link>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
