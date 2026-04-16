'use client';
// TimeSlotPicker — time slot grid with available/booked states

export default function TimeSlotPicker({ slots, selectedTime, onSelect, loading }) {

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="h-11 skeleton rounded-lg" />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
          <svg width="20" height="20" fill="none" stroke="#9CA3AF" strokeWidth="1.75" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500">No slots available</p>
        <p className="text-xs text-gray-400 mt-1">Try selecting a different date.</p>
      </div>
    );
  }

  const available = slots.filter(s => s.available).length;

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3">
        {available} slot{available !== 1 ? 's' : ''} available
      </p>
      <div className="grid grid-cols-2 gap-2">
        {slots.map(slot => (
          <button
            key={slot.time}
            onClick={() => slot.available && onSelect(slot.time)}
            disabled={!slot.available}
            className={`py-2.5 px-3 rounded-lg text-sm font-medium text-center transition-all border ${
              selectedTime === slot.time
                ? 'bg-[#006BFF] text-white border-[#006BFF] shadow-sm shadow-blue-200'
                : slot.available
                ? 'border-gray-200 text-gray-700 hover:border-[#006BFF] hover:text-[#006BFF] hover:bg-blue-50'
                : 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50 line-through'
            }`}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  );
}
