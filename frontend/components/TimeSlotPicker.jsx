'use client';
// components/TimeSlotPicker.jsx
// Shows available and booked time slots as a grid of buttons.

export default function TimeSlotPicker({ slots, selectedTime, onSelect, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="h-11 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">
        No available slots for this day.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {slots.map((slot) => (
        <button
          key={slot.time}
          onClick={() => slot.available && onSelect(slot.time)}
          disabled={!slot.available}
          className={`py-2.5 px-3 rounded-lg text-sm font-medium text-center transition-all border ${
            selectedTime === slot.time
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : slot.available
              ? 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
              : 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
          }`}
        >
          {slot.label}
        </button>
      ))}
    </div>
  );
}
