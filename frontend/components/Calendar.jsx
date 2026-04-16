'use client';
/**
 * Calendar Component
 * Renders an interactive monthly calendar for selecting dates.
 */

import { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ availability = [], selectedDate, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isPast = (day) => {
    const date = new Date(year, month, day, 23, 59, 59);
    return date < new Date();
  };

  const isAvailableDay = (day) => {
    if (isPast(day)) return false;
    const dow = new Date(year, month, day).getDay();
    const dayConfig = availability.find(a => a.day_of_week === dow);
    return dayConfig && dayConfig.is_available;
  };

  const fmtDate = (d) => {
    const yyyy = year;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="w-full max-w-[380px] select-none">
      
      {/* Month Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[17px] font-bold text-gray-900">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-1.5">
          <button
            onClick={prevMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-[#0066FF] transition-all duration-200"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={nextMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-[#0066FF] transition-all duration-200"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-3">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-gray-300 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-1.5 gap-x-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const available = isAvailableDay(day);
          const dateStr = fmtDate(day);
          const selected = selectedDate === dateStr;
          const past = isPast(day);
          const today = isToday(day);

          return (
            <div key={day} className="flex justify-center shrink-0">
              <button
                disabled={!available || past}
                onClick={() => available && onDateSelect(dateStr)}
                className={`w-[42px] h-[42px] flex items-center justify-center rounded-xl text-[14px] font-semibold transition-all duration-200
                  ${selected ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20 scale-105' : 
                    available && !past ? 'bg-blue-50/60 text-[#0066FF] hover:bg-blue-100 hover:scale-105' : 
                    'text-gray-200 cursor-not-allowed'}
                  ${today && !selected && available ? 'ring-2 ring-offset-1 ring-[#0066FF]/40' : ''}
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
