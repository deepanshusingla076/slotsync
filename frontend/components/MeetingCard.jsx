// components/MeetingCard.jsx
// Displays one meeting with invitee info, time, and optional cancel button.

import { formatDate, formatTime } from '@/lib/utils';

export default function MeetingCard({ meeting, showCancel, onCancel }) {
  const isCancelled = meeting.status === 'cancelled';

  return (
    <div className={`card p-5 flex items-start gap-4 ${isCancelled ? 'opacity-60' : ''}`}>

      {/* Color stripe */}
      <div
        className="w-1 self-stretch rounded-full flex-shrink-0"
        style={{ backgroundColor: meeting.color || '#2563EB' }}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {/* Event type label */}
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
              {meeting.event_title}
            </p>
            {/* Invitee name */}
            <h3 className="font-semibold text-gray-900 truncate">{meeting.invitee_name}</h3>
            {/* Invitee email */}
            <p className="text-sm text-gray-500 truncate">{meeting.invitee_email}</p>
          </div>

          {/* Status badge */}
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
            isCancelled
              ? 'bg-red-50 text-red-500'
              : 'bg-green-50 text-green-600'
          }`}>
            {isCancelled ? 'Cancelled' : 'Confirmed'}
          </span>
        </div>

        {/* Date, time, duration */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {formatDate(meeting.start_time)}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
            </svg>
            {formatTime(meeting.start_time)} · {meeting.duration_minutes} min
          </span>
        </div>
      </div>

      {/* Cancel button */}
      {showCancel && !isCancelled && (
        <button onClick={onCancel} className="btn-danger flex-shrink-0">
          Cancel
        </button>
      )}

    </div>
  );
}
