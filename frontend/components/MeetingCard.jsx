'use client';
/**
 * MeetingCard Component
 * Displays individual meeting details in a styled card format.
 */

import { formatDate, formatTime } from '@/lib/utils';

export default function MeetingCard({ meeting, showCancel, onCancel }) {
  const cancelled = meeting.status === 'cancelled';
  const isPast    = new Date(meeting.end_time) < new Date() && !cancelled;

  return (
    <div className={`card flex flex-col md:flex-row overflow-hidden ${cancelled ? 'opacity-50 grayscale bg-gray-50' : 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300'}`}>

      {/* Accent stripe */}
      <div
        className="h-1 md:h-auto md:w-1 flex-shrink-0 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl"
        style={{ backgroundColor: cancelled ? '#D1D5DB' : (meeting.color || '#0066FF') }}
      />

      <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 min-w-0">

        {/* Left: Invitee Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {meeting.event_title}
            </span>
            {cancelled ? (
              <span className="badge-red">Cancelled</span>
            ) : isPast ? (
              <span className="badge-gray">Completed</span>
            ) : (
              <span className="badge-green">Upcoming</span>
            )}
          </div>

          <h3 className="text-base font-bold text-gray-900 truncate mb-1.5">
            {meeting.invitee_name}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-gray-400 truncate">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="truncate">{meeting.invitee_email}</span>
          </div>
        </div>

        {/* Right: Date/Time + Action */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 flex-shrink-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
          <div className="text-left sm:text-right">
            <p className="text-[15px] font-bold text-gray-900">
              {formatDate(meeting.start_time)}
            </p>
            <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5 justify-start sm:justify-end">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {formatTime(meeting.start_time)} • {meeting.duration_minutes} min
            </p>
          </div>

          {showCancel && !cancelled && (
            <button
              onClick={onCancel}
              className="px-4 py-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 hover:border-red-200 transition-all"
            >
              Cancel
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
