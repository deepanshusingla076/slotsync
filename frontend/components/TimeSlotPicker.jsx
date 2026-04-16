'use client';
/**
 * TimeSlotPicker Component
 * Renders available time slots for booking and handles user selection.
 */

export default function TimeSlotPicker({ slots, selectedTime, onSelect, loading }) {

  if (loading) {
    return (
      <div className="flex flex-col gap-2.5">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="h-12 w-full skeleton" />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-3">
          <svg width="22" height="22" fill="none" stroke="#D1D5DB" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </div>
        <p className="text-sm font-bold text-gray-900 mb-1">No times available</p>
        <p className="text-xs text-gray-400">Pick another day to see slots.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-1 -mr-1">
      {slots.map(slot => (
        <button
          key={slot.time}
          onClick={() => slot.available && onSelect(slot.time)}
          disabled={!slot.available}
          className={`
            w-full py-3 px-4 rounded-xl text-center font-bold text-[15px] transition-all duration-200 border
            ${selectedTime === slot.time
              ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md shadow-blue-500/20'
              : slot.available
              ? 'bg-white border-blue-100 text-[#0066FF] hover:border-[#0066FF] hover:bg-blue-50/50 hover:shadow-sm'
              : 'bg-gray-50 border-gray-50 text-gray-200 line-through cursor-not-allowed'}
          `}
        >
          {slot.label}
        </button>
      ))}
    </div>
  );
}
