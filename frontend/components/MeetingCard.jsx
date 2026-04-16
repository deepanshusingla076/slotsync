'use client';
// MeetingCard — Calendly-style meeting row

import { formatDate, formatTime } from '@/lib/utils';

export default function MeetingCard({ meeting, showCancel, onCancel }) {
  const cancelled = meeting.status === 'cancelled';
  const isPast    = new Date(meeting.end_time) < new Date() && !cancelled;

  return (
    <div className={`card flex items-stretch overflow-hidden transition-all hover:shadow-md ${cancelled ? 'opacity-60' : ''}`}>

      {/* Left colour stripe */}
      <div
        className="w-1.5 flex-shrink-0"
        style={{ backgroundColor: meeting.color || '#006BFF' }}
      />

      {/* Main content */}
      <div className="flex-1 flex items-center gap-4 px-5 py-4 min-w-0">

        {/* Info column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
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
          <h3 className="font-semibold text-gray-900 truncate text-[15px]">
            {meeting.invitee_name}
          </h3>
          <p className="text-sm text-gray-500 truncate mt-0.5">
            {meeting.invitee_email}
          </p>
        </div>

        {/* Date/time column */}
        <div className="text-right flex-shrink-0 hidden sm:block">
          <p className="text-sm font-semibold text-gray-900">
            {formatDate(meeting.start_time)}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatTime(meeting.start_time)} · {meeting.duration_minutes} min
          </p>
        </div>

        {/* Cancel button */}
        {showCancel && !cancelled && (
          <button
            onClick={onCancel}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
