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
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-[#006BFF] hover:bg-blue-100 transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={nextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-[#006BFF] hover:bg-blue-100 transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-4">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1">
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
                className={`w-[44px] h-[44px] flex items-center justify-center rounded-full text-[15px] font-bold transition-all
                  ${selected ? 'bg-[#006BFF] text-white shadow-md' : 
                    available && !past ? 'bg-[#EBF2FF] text-[#006BFF] hover:bg-blue-100' : 
                    'text-gray-300 opacity-50 cursor-not-allowed'}
                  ${today && !selected && available ? 'ring-2 ring-offset-2 ring-[#006BFF]' : ''}
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
