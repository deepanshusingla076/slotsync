'use client';
/**
 * TimeSlotPicker Component
 * Renders available time slots for booking and handles user selection.
 */

export default function TimeSlotPicker({ slots, selectedTime, onSelect, loading }) {

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array(7).fill(0).map((_, i) => (
          <div key={i} className="h-12 w-full skeleton rounded-lg" />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center bg-gray-50/50 border border-gray-200 border-dashed rounded-xl">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-3">
          <svg width="24" height="24" fill="none" stroke="#9CA3AF" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">No times available</p>
        <p className="text-xs text-gray-500">Pick another day to see available times.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[500px] pr-2 -mr-2">
      {slots.map(slot => (
        <div key={slot.time} className="flex gap-2">
          <button
            onClick={() => slot.available && onSelect(slot.time)}
            disabled={!slot.available}
            className={`
              flex-1 py-3.5 px-4 rounded-xl text-center font-bold text-[15px] transition-all border shrink-0
              ${selectedTime === slot.time
                ? 'bg-gray-600 text-white border-gray-600 w-[48%]'
                : slot.available
                ? 'bg-white border-blue-200 text-[#006BFF] hover:border-[#006BFF] hover:border-2 hover:py-[13px] w-full'
                : 'bg-gray-50 border-gray-100 text-gray-300 line-through cursor-not-allowed w-full'}
            `}
          >
            {slot.label}
          </button>

          {selectedTime === slot.time && (
            <button
              onClick={() => onSelect(slot.time, true)}
              className="flex-1 bg-[#006BFF] hover:bg-[#0052CC] text-white font-bold text-[15px] rounded-xl transition-colors shadow-sm"
            >
              Next
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
