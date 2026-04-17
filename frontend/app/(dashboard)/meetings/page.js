'use client';
/**
 * Meetings Dashboard Page
 * Lists all upcoming and past meetings for the user, with options to manage them.
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';
import MeetingCard from '@/components/MeetingCard';

export default function MeetingsPage() {
  const [tab,      setTab]      = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [past,     setPast]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [u, p] = await Promise.all([api.getUpcomingMeetings(), api.getPastMeetings()]);
      setUpcoming(u); setPast(p);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this event?')) return;
    try {
      await api.cancelMeeting(id);
      const cancelled = upcoming.find(m => m.id === id);
      setUpcoming(prev => prev.filter(m => m.id !== id));
      if (cancelled) setPast(prev => [{ ...cancelled, status: 'cancelled' }, ...prev]);
    } catch (e) {
      setError(e.message || 'Failed to cancel event');
    }
  };

  const activeMeetings = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="min-h-full flex flex-col bg-white">

      {/* Header */}
      <div className="px-4 sm:px-8 pt-6 pb-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Events</h1>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-2 bg-white">
        <div className="max-w-6xl mx-auto w-full">

          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 animate-fade-in">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <div className="flex-1">
                <p className="font-semibold mb-0.5">Failed to load</p>
                <p>{error}</p>
              </div>
              <button onClick={load} className="text-[#0066FF] font-semibold hover:underline">Retry</button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-5 rounded-xl border border-slate-200 p-1 w-fit">
            {[
              { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
              { id: 'past',     label: 'Past',     count: past.length },
            ].map(t => (
              <button
                key={t.id} onClick={() => setTab(t.id)}
                className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  tab === t.id ? 'text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t.label}
                {t.count > 0 && (
                  <span className={`inline-flex items-center justify-center px-2 min-w-[22px] h-5 rounded-full text-[11px] font-bold transition-colors ${
                    tab === t.id ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pb-20 md:pb-6">
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 w-full" />)}
              </div>
            )}

            {!loading && activeMeetings.length === 0 && !error && (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30 animate-fade-in-up">
                <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <svg width="28" height="28" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No {tab} events</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  {tab === 'upcoming' ? 'When someone books a time with you, it will appear here.' : 'Your past and cancelled meetings will be listed here.'}
                </p>
              </div>
            )}

            {!loading && activeMeetings.length > 0 && (
              <div className="space-y-3 animate-fade-in-up">
                {activeMeetings.map(m => (
                  <MeetingCard key={m.id} meeting={m} showCancel={tab === 'upcoming'} onCancel={() => handleCancel(m.id)} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
