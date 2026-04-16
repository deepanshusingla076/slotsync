'use client';
// Meetings page — Calendly-style Scheduled Events

import { useState, useEffect } from 'react';
import * as api from '@/lib/api';
import MeetingCard from '@/components/MeetingCard';

export default function MeetingsPage() {
  const [tab,      setTab]      = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [past,     setPast]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [u, p] = await Promise.all([
        api.getUpcomingMeetings(),
        api.getPastMeetings(),
      ]);
      setUpcoming(u);
      setPast(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this meeting? This cannot be undone.')) return;
    try {
      await api.cancelMeeting(id);
      const cancelled = upcoming.find(m => m.id === id);
      setUpcoming(p => p.filter(m => m.id !== id));
      if (cancelled) setPast(p => [{ ...cancelled, status: 'cancelled' }, ...p]);
    } catch (err) {
      alert(err.message);
    }
  };

  const meetings = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="min-h-full">

      {/* ── Header ────────────────────────────── */}
      <div className="px-8 pt-8 pb-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Events</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all your booked meetings.</p>
        </div>
      </div>

      <div className="px-8 py-8 max-w-3xl mx-auto">

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            {error}
            <button onClick={load} className="ml-auto text-[#006BFF] font-medium hover:underline">Retry</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
            { key: 'past',     label: 'Past',     count: past.length },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px flex items-center gap-2 ${
                tab === t.key
                  ? 'border-[#006BFF] text-[#006BFF]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                    tab === t.key ? 'bg-[#EBF2FF] text-[#006BFF]' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-5 flex items-center gap-4">
                <div className="w-1 h-16 rounded-full skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 skeleton" />
                  <div className="h-5 w-1/2 skeleton" />
                  <div className="h-3 w-1/3 skeleton" />
                </div>
                <div className="text-right hidden sm:block space-y-2">
                  <div className="h-4 w-28 skeleton" />
                  <div className="h-3 w-20 skeleton" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty states */}
        {!loading && meetings.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" fill="none" stroke="#9CA3AF" strokeWidth="1.75" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">No {tab} events</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              {tab === 'upcoming'
                ? 'New bookings will appear here once someone schedules time with you.'
                : 'Past and cancelled meetings will show up here.'}
            </p>
          </div>
        )}

        {/* Meeting list */}
        {!loading && meetings.length > 0 && (
          <div className="space-y-3">
            {meetings.map(meeting => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                showCancel={tab === 'upcoming'}
                onCancel={() => handleCancel(meeting.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
