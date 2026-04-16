'use client';
// app/(dashboard)/availability/page.js
// Weekly availability settings — toggle days, set working hours.

import { useState, useEffect } from 'react';
import * as api from '@/lib/api';
import { DAY_NAMES } from '@/lib/utils';

// Default 7-day template (shown before data loads)
const DEFAULT_DAYS = DAY_NAMES.map((_, i) => ({
  day_of_week:  i,
  start_time:   '09:00',
  end_time:     '17:00',
  is_available: i >= 1 && i <= 5, // Mon–Fri available by default
}));

export default function AvailabilityPage() {
  const [days,    setDays]    = useState(DEFAULT_DAYS);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.getAvailability()
      .then(data => {
        if (data && data.length > 0) {
          // MySQL returns TIME as "09:00:00" — trim to "09:00"
          setDays(data.map(d => ({
            ...d,
            start_time: d.start_time.substring(0, 5),
            end_time:   d.end_time.substring(0, 5),
          })));
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (index) =>
    setDays(prev => prev.map((d, i) =>
      i === index ? { ...d, is_available: !d.is_available } : d
    ));

  const setTime = (index, field, value) =>
    setDays(prev => prev.map((d, i) =>
      i === index ? { ...d, [field]: value } : d
    ));

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      await api.saveAvailability(days);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-56 bg-gray-100 rounded animate-pulse mb-8" />
        <div className="card divide-y divide-gray-100">
          {Array(7).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="w-10 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-48 h-8 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Availability</h1>
        <p className="text-gray-500 text-sm mt-1">Set your weekly working hours.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}

      {/* Days list */}
      <div className="card divide-y divide-gray-100">
        {days.map((day, index) => (
          <div
            key={day.day_of_week}
            className={`flex items-center gap-4 px-6 py-4 transition-opacity ${
              !day.is_available ? 'opacity-50' : ''
            }`}
          >
            {/* Toggle */}
            <button
              onClick={() => toggle(index)}
              className={`toggle-track flex-shrink-0 ${day.is_available ? 'bg-blue-600' : 'bg-gray-200'}`}
              title={day.is_available ? 'Click to disable' : 'Click to enable'}
            >
              <span className={`toggle-thumb ${day.is_available ? 'translate-x-5' : ''}`} />
            </button>

            {/* Day name */}
            <span className="w-28 text-sm font-medium text-gray-900 flex-shrink-0">
              {DAY_NAMES[day.day_of_week]}
            </span>

            {/* Time pickers */}
            {day.is_available ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={day.start_time}
                  onChange={e => setTime(index, 'start_time', e.target.value)}
                  className="input-field w-32 text-sm"
                />
                <span className="text-gray-400 text-sm font-medium">to</span>
                <input
                  type="time"
                  value={day.end_time}
                  onChange={e => setTime(index, 'end_time', e.target.value)}
                  className="input-field w-32 text-sm"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic">Unavailable</span>
            )}
          </div>
        ))}
      </div>

      {/* Save button + success feedback */}
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleSave} disabled={saving} className="btn-primary min-w-[120px]">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>

        {success && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Saved successfully
          </span>
        )}
      </div>

    </div>
  );
}
