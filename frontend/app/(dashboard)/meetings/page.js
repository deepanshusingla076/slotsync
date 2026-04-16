'use client';
// app/(dashboard)/meetings/page.js
// Shows upcoming and past meetings with a tab switcher.

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
    const load = async () => {
      try {
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
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;
    try {
      await api.cancelMeeting(id);
      // Move from upcoming to past visually
      const cancelled = upcoming.find(m => m.id === id);
      setUpcoming(prev => prev.filter(m => m.id !== id));
      if (cancelled) setPast(prev => [{ ...cancelled, status: 'cancelled' }, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  const meetings = tab === 'upcoming' ? upcoming : past;

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="p-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all your scheduled meetings.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
        {[
          { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { key: 'past',     label: 'Past',     count: past.length     },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                tab === t.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {meetings.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="text-5xl mb-4">{tab === 'upcoming' ? '📅' : '🕰️'}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No {tab} meetings
          </h3>
          <p className="text-gray-400 text-sm">
            {tab === 'upcoming'
              ? 'New bookings will appear here once someone books a slot.'
              : 'Completed and cancelled meetings will show up here.'}
          </p>
        </div>
      ) : (
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
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-52 bg-gray-100 rounded animate-pulse mb-8" />
      <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse mb-6" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-5 flex gap-4">
            <div className="w-1 h-16 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
