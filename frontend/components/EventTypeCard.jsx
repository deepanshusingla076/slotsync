'use client';
/**
 * EventTypeCard Component
 * Displays a summary of an event type with a clean, professional card design.
 */

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
    <div className="flex flex-col h-full relative overflow-hidden group bg-white border border-slate-200 rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">

      {/* Accent color stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200"
        style={{ backgroundColor: event.color || '#0066FF' }}
      />

      <div className="p-4 pl-5 flex-1 flex flex-col relative w-full">
        <div className="mb-3">
           <h3 className="text-[15px] font-bold text-slate-900 leading-snug pr-2">
             {event.title}
           </h3>
        </div>

        <div className="flex items-center gap-2 mb-3">
           <div className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
             {event.duration_minutes} min
           </div>
        </div>

        <button
            onClick={copyLink}
          className="flex items-center gap-1.5 text-[11px] font-medium text-[#0066FF] hover:underline mb-2.5 w-fit"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          {copied ? 'Copied link' : (event.slug ? `default_user/${event.slug}` : `default_user/meeting`)}
        </button>

        {event.description && (
          <p className="text-xs text-slate-600 line-clamp-2 flex-1 leading-relaxed">
            {event.description}
          </p>
        )}

        {!event.description && <div className="flex-1" />}

        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors duration-150"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
            Edit
          </button>

          {event.is_active ? (
            <Link
              href={`/book/${event.slug}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-semibold text-[#0066FF] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-150"
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v7H3V3h7"/></svg>
              Preview
            </Link>
          ) : (
            <div className="inline-flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v7H3V3h7"/></svg>
              Preview
            </div>
          )}

          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-150 col-span-2 sm:col-span-1"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
