'use client';
// Availability — Calendly-style weekly hours editor with timezone

import { useState, useEffect } from 'react';
import * as api from '@/lib/api';
import { DAY_NAMES } from '@/lib/utils';

const TIMEZONES = [
  'Asia/Kolkata','Asia/Dubai','Asia/Singapore','Asia/Tokyo',
  'Europe/London','Europe/Paris','Europe/Berlin',
  'America/New_York','America/Chicago','America/Denver',
  'America/Los_Angeles','America/Sao_Paulo',
  'Australia/Sydney','Pacific/Auckland',
];

const DEFAULT_DAYS = DAY_NAMES.map((_, i) => ({
  day_of_week: i,
  start_time:  '09:00',
  end_time:    '17:00',
  is_available: i >= 1 && i <= 5,
}));

export default function AvailabilityPage() {
  const [days,     setDays]     = useState(DEFAULT_DAYS);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [avail, settings] = await Promise.all([
          api.getAvailability(),
          api.getSettings(),
        ]);
        if (avail?.length) {
          setDays(avail.map(d => ({
            ...d,
            is_available: Boolean(d.is_available),
            start_time: String(d.start_time).substring(0, 5),
            end_time:   String(d.end_time).substring(0, 5),
          })));
        }
        if (settings?.timezone) setTimezone(settings.timezone);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle  = (i)     => setDays(p => p.map((d, idx) => idx === i ? { ...d, is_available: !d.is_available } : d));
  const setTime = (i,f,v) => setDays(p => p.map((d, idx) => idx === i ? { ...d, [f]: v } : d));

  const handleSave = async () => {
    setSaving(true); setSuccess(false); setError('');
    try {
      await Promise.all([
        api.saveAvailability(days),
        api.updateSettings({ timezone }),
      ]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-full">
      <div className="px-8 pt-8 pb-6 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto">
          <div className="h-7 w-36 skeleton mb-2" />
          <div className="h-4 w-56 skeleton" />
        </div>
      </div>
      <div className="px-8 py-8 max-w-2xl mx-auto space-y-3">
        {Array(7).fill(0).map((_, i) => <div key={i} className="card p-4 h-14 skeleton" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-sm text-gray-500 mt-1">
            Set the times you&apos;re available for bookings each week.
          </p>
        </div>
      </div>

      <div className="px-8 py-8 max-w-2xl mx-auto space-y-6">

        {/* Timezone picker */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <svg width="16" height="16" fill="none" stroke="#006BFF" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span className="text-sm font-semibold text-gray-900">Timezone</span>
          </div>
          <select
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            className="select-field text-sm"
          >
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Weekly schedule */}
        <div className="card divide-y divide-gray-100">
          <div className="px-5 py-3 bg-gray-50 rounded-t-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weekly Hours</p>
          </div>
          {days.map((day, index) => (
            <div key={day.day_of_week} className="flex items-center gap-4 px-5 py-3.5">
              {/* Toggle */}
              <button
                onClick={() => toggle(index)}
                className={`toggle-track ${day.is_available ? 'bg-[#006BFF]' : 'bg-gray-200'}`}
                aria-label={`Toggle ${DAY_NAMES[day.day_of_week]}`}
              >
                <span className={`toggle-thumb ${day.is_available ? 'translate-x-5' : ''}`} />
              </button>

              {/* Day name */}
              <span className={`w-28 text-sm font-semibold flex-shrink-0 ${day.is_available ? 'text-gray-900' : 'text-gray-400'}`}>
                {DAY_NAMES[day.day_of_week]}
              </span>

              {/* Hours or unavailable label */}
              {day.is_available ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time" value={day.start_time}
                    onChange={e => setTime(index, 'start_time', e.target.value)}
                    className="input-field w-32 text-sm py-2"
                  />
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0">–</span>
                  <input
                    type="time" value={day.end_time}
                    onChange={e => setTime(index, 'end_time', e.target.value)}
                    className="input-field w-32 text-sm py-2"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">Unavailable</span>
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            {error}
          </div>
        )}

        {/* Save */}
        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : 'Save Changes'}
          </button>
          {success && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-fade-in">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              Changes saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
