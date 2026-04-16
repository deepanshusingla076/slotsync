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
    <div className={`card flex flex-col md:flex-row overflow-hidden ${cancelled ? 'opacity-50 grayscale bg-gray-50' : 'hover:shadow-md transition-shadow'}`}>
      
      {/* Accent stripe */}
      <div 
        className="h-1.5 md:h-auto md:w-1.5 flex-shrink-0" 
        style={{ backgroundColor: cancelled ? '#9CA3AF' : (meeting.color || '#006BFF') }} 
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
          
          <h3 className="text-[17px] font-semibold text-gray-900 truncate mb-1">
            {meeting.invitee_name}
          </h3>
          
          <div className="flex items-center gap-1.5 text-sm text-gray-500 truncate">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <span className="truncate">{meeting.invitee_email}</span>
          </div>
        </div>

        {/* Right: Date/Time + Action */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 flex-shrink-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
          <div className="text-left sm:text-right">
            <p className="text-[15px] font-semibold text-gray-900">
              {formatDate(meeting.start_time)}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {formatTime(meeting.start_time)} • {meeting.duration_minutes} min
            </p>
          </div>

          {showCancel && !cancelled && (
            <button
              onClick={onCancel}
              className="px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
