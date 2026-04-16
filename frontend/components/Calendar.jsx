'use client';
// components/Calendar.jsx
// Custom month-view calendar — no external library needed.
// Disables past dates and days the host is unavailable.

import { useState } from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ availability = [], selectedDate, onDateSelect }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year  = view.getFullYear();
  const month = view.getMonth();

  // Map day_of_week → is_available for quick lookup
  const availMap = {};
  availability.forEach(a => { availMap[a.day_of_week] = a.is_available; });

  const firstWeekday = new Date(year, month, 1).getDay(); // 0–6
  const daysInMonth  = new Date(year, month + 1, 0).getDate();

  // Build flat grid: nulls for leading empty cells, then 1…daysInMonth
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isAvailable = (day) => {
    const d = new Date(year, month, day);
    if (d < today) return false;                    // past
    return !!availMap[d.getDay()];                  // host isn't available
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate + 'T12:00:00');
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  };

  const isToday = (day) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const prevMonth = () => setView(new Date(year, month - 1, 1));
  const nextMonth = () => setView(new Date(year, month + 1, 1));

  const canGoPrev = !(year === today.getFullYear() && month === today.getMonth());

  const handleClick = (day) => {
    if (!isAvailable(day)) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(dateStr);
  };

  return (
    <div className="w-full max-w-sm">

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <span className="font-semibold text-gray-900">
          {MONTH_NAMES[month]} {year}
        </span>

        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <button
                onClick={() => handleClick(day)}
                disabled={!isAvailable(day)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-all
                  ${isSelected(day)
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isAvailable(day)
                    ? 'text-gray-900 hover:bg-blue-50 hover:text-blue-600'
                    : 'text-gray-300 cursor-not-allowed'
                  }
                  ${isToday(day) && !isSelected(day) ? 'font-bold underline underline-offset-2' : ''}
                `}
              >
                {day}
              </button>
            ) : <div className="w-9 h-9" />}
          </div>
        ))}
      </div>
    </div>
  );
}
