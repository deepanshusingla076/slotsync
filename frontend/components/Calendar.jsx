'use client';
// Calendar — Calendly-faithful month calendar component
// Single-letter day headers, circular cells, today underline, selected = filled blue

import { useState } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_HEADS = ['S','M','T','W','T','F','S'];

export default function Calendar({ availability = [], selectedDate, onDateSelect }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year  = view.getFullYear();
  const month = view.getMonth();

  // Availability map: { 0: false, 1: true, … }
  const avMap = {};
  availability.forEach(a => { avMap[a.day_of_week] = Boolean(a.is_available); });

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isAvailable = (day) => {
    const d = new Date(year, month, day);
    return d >= today && avMap[d.getDay()];
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate + 'T12:00:00');
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  };

  const isToday = (day) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const canPrev = !(year === today.getFullYear() && month === today.getMonth());

  const handleClick = (day) => {
    if (!isAvailable(day)) return;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onDateSelect(`${year}-${mm}-${dd}`);
  };

  return (
    <div className="w-full max-w-[360px]">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setView(new Date(year, month - 1, 1))}
          disabled={!canPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <span className="font-bold text-gray-900">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_HEADS.map((d, i) => (
          <div key={i} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const avail    = isAvailable(day);
          const selected = isSelected(day);
          const tod      = isToday(day);

          return (
            <div key={i} className="flex items-center justify-center">
              <button
                onClick={() => handleClick(day)}
                disabled={!avail}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-all duration-100
                  ${selected
                    ? 'bg-[#006BFF] text-white shadow-sm'
                    : avail
                    ? 'text-gray-900 hover:bg-[#EBF2FF] hover:text-[#006BFF]'
                    : 'text-gray-300 cursor-default'
                  }
                  ${tod && !selected ? 'font-bold underline decoration-[#006BFF] underline-offset-2' : ''}
                `}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
