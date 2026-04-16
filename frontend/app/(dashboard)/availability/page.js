'use client';
// Availability — Professional Revert

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIMEZONES = [
  'Asia/Kolkata','Asia/Dubai','Asia/Singapore','Asia/Tokyo',
  'Europe/London','Europe/Paris','Europe/Berlin',
  'America/New_York','America/Chicago','America/Denver',
  'America/Los_Angeles','America/Sao_Paulo',
  'Australia/Sydney','Pacific/Auckland',
];

const DEFAULT_DAYS = DAY_NAMES.map((_, i) => ({ day_of_week: i, start_time: '09:00', end_time: '17:00', is_available: i >= 1 && i <= 5 }));

export default function AvailabilityPage() {
  const [days,     setDays]     = useState(DEFAULT_DAYS);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true); setError('');
      const [avail, settings] = await Promise.all([api.getAvailability(), api.getSettings()]);
      if (avail?.length) {
        setDays(avail.map(d => ({
          ...d, is_available: Boolean(d.is_available),
          start_time: String(d.start_time).substring(0, 5),
          end_time: String(d.end_time).substring(0, 5),
        })));
      }
      if (settings?.timezone) setTimezone(settings.timezone);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = (i) => setDays(p => p.map((d, idx) => idx === i ? { ...d, is_available: !d.is_available } : d));
  const setTime = (i, f, v) => setDays(p => p.map((d, idx) => idx === i ? { ...d, [f]: v } : d));

  const handleSave = async () => {
    setSaving(true); setSuccess(false); setError('');
    try {
      await Promise.all([api.saveAvailability(days), api.updateSettings({ timezone })]);
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="p-8">
      <div className="skeleton h-8 max-w-sm mb-8" />
      <div className="space-y-4 max-w-3xl">
        {Array(7).fill(0).map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-full flex flex-col bg-gray-50/50">
      
      {/* Header */}
      <div className="page-header">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Settings</p>
            <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          </div>
          <div className="flex items-center gap-4">
            {success && <span className="text-sm font-semibold text-emerald-600">Saved successfully</span>}
            <button onClick={handleSave} disabled={saving} className="btn-primary rounded-full px-6">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <span>{error}</span>
            </div>
          )}

          <div className="card p-6">
            <h2 className="text-base font-bold text-gray-900 mb-1">Timezone</h2>
            <p className="text-sm text-gray-500 mb-4">Set your base timezone. Clients will see times converted automatically.</p>
            <div className="max-w-sm">
              <select value={timezone} onChange={e => setTimezone(e.target.value)} className="select-field">
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">Weekly hours</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {days.map((day, index) => (
                <div key={day.day_of_week} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  
                  <div className="flex items-center w-full sm:w-48 shrink-0 gap-3">
                    <button
                      onClick={() => toggle(index)}
                      className={`toggle-track ${day.is_available ? 'bg-blue-600' : 'bg-gray-200'}`} aria-checked={day.is_available}
                    >
                      <span className={`toggle-thumb ${day.is_available ? 'translate-x-[22px]' : ''}`} />
                    </button>
                    <span className={`text-[15px] font-semibold w-24 ${day.is_available ? 'text-gray-900' : 'text-gray-400'}`}>
                      {DAY_NAMES[day.day_of_week]}
                    </span>
                  </div>

                  <div className="flex-1">
                    {day.is_available ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="time" value={day.start_time} onChange={e => setTime(index, 'start_time', e.target.value)}
                          className="field !w-32 !py-2 text-center"
                        />
                        <span className="text-gray-400 font-medium">-</span>
                        <input
                          type="time" value={day.end_time} onChange={e => setTime(index, 'end_time', e.target.value)}
                          className="field !w-32 !py-2 text-center"
                        />
                      </div>
                    ) : (
                      <span className="text-[15px] text-gray-400 font-medium">Unavailable</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
