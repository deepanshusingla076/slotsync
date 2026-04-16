'use client';
// EventTypeCard — Calendly-faithful card with color dot, actions

import { useState } from 'react';
import Link from 'next/link';

export default function EventTypeCard({ event, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}/book/${event.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card-hover overflow-hidden group flex flex-col">

      {/* Top color accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: event.color }} />

      {/* Card body */}
      <div className="p-6 flex-1">
        {/* Colour dot */}
        <div
          className="w-3 h-3 rounded-full mb-5 shadow-sm"
          style={{ backgroundColor: event.color }}
        />

        <h3 className="font-semibold text-gray-900 text-[15px] mb-1.5 leading-snug">
          {event.title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          {event.duration_minutes} min · One-on-One
        </p>

        {event.description && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        {!event.is_active && (
          <span className="badge-gray mt-3 inline-flex">Inactive</span>
        )}
      </div>

      {/* Card footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-2">

        {/* Left: copy link + open */}
        <div className="flex items-center gap-3">
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006BFF] font-medium transition-colors"
          >
            {copied ? (
              <>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                Copy link
              </>
            )}
          </button>

          {event.is_active && (
            <Link
              href={`/book/${event.slug}`}
              target="_blank"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#006BFF] transition-colors"
              title="Open booking page"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </Link>
          )}
        </div>

        {/* Right: edit / delete (appear on hover) */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            title="Edit"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
