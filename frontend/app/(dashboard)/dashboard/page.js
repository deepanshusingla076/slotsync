'use client';
/**
 * Main Dashboard Page
 * Displays an overview of user statistics and a list of active event types.
 */

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import * as api from '@/lib/api';
import EventTypeCard  from '@/components/EventTypeCard';
import EventTypeModal from '@/components/EventTypeModal';

function DashboardContent() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [origin,     setOrigin]     = useState('');
  const [error,      setError]      = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const EVENT_TYPES_CACHE_KEY = 'slotsync_event_types_cache_v1';

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const fresh = await api.getEventTypes();
      setEventTypes(fresh);
      localStorage.setItem(EVENT_TYPES_CACHE_KEY, JSON.stringify({ data: fresh, at: Date.now() }));
    } catch(e) {
      setError(e.message || 'Failed to load event types');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setOrigin(window.location.origin);
    try {
      const raw = localStorage.getItem(EVENT_TYPES_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.data)) {
          setEventTypes(parsed.data);
          setLoading(false);
        }
      }
    } catch (e) {
      console.error('Failed to hydrate event type cache:', e);
    }
    load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setEditing(null);
      setShowModal(true);
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event type?')) return;
    try {
      await api.deleteEventType(id);
      setEventTypes(p => p.filter(e => e.id !== id));
    } catch (e) {
      setError(e.message || 'Failed to delete event type');
    }
  };

  const active   = eventTypes.filter(e => e.is_active);
  const inactive = eventTypes.filter(e => !e.is_active);

  return (
    <div className="min-h-full flex flex-col bg-white">

      {/* Header */}
      <div className="pt-5 pb-3 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Event Types</h1>
            <p className="text-sm sm:text-[15px] text-slate-500">Create events people can book directly from your link.</p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <span>+</span> New Event Type
          </button>
        </div>
        {!loading && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-xl font-bold text-slate-900">{eventTypes.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">Active</p>
              <p className="text-xl font-bold text-slate-900">{active.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-500">Inactive</p>
              <p className="text-xl font-bold text-slate-900">{inactive.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-fade-in">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <div className="flex-1">
                <p className="font-semibold mb-0.5">Action failed</p>
                <p>{error}</p>
              </div>
              <button onClick={load} className="text-[#0066FF] font-semibold hover:underline">Retry</button>
            </div>
          )}

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="skeleton h-48 w-full" />)}
            </div>
          )}

          {!loading && eventTypes.length === 0 && (
            <div className="text-center py-16 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col items-center animate-fade-in-up">
              <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-md flex items-center justify-center mb-5">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No event types yet</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto text-[15px] leading-relaxed">
                Create your first event type to start receiving bookings from people.
              </p>
              <button onClick={() => setShowModal(true)} className="btn-primary rounded-xl px-6 py-2.5">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                New Event Type
              </button>
            </div>
          )}

          {!loading && active.length > 0 && (
            <section className="animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map(evt => (
                  <EventTypeCard key={evt.id} event={evt} origin={origin} onEdit={() => {setEditing(evt); setShowModal(true)}} onDelete={() => handleDelete(evt.id)} />
                ))}
                <button 
                  onClick={() => { setEditing(null); setShowModal(true); }}
                  className="flex flex-col items-center justify-center min-h-[140px] bg-[#fff] border-2 border-dashed border-blue-200 rounded-2xl hover:bg-blue-50/40 transition-colors duration-200 text-slate-600 hover:text-slate-900"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mb-2 text-blue-500"><path d="M12 5v14M5 12h14"/></svg>
                  <span className="text-[14px] font-medium text-slate-700">New Event Type</span>
                </button>
              </div>
            </section>
          )}

          {!loading && inactive.length > 0 && (
            <section className="opacity-70 animate-fade-in-up stagger-2">
               <div className="flex items-center gap-3 mb-5">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  Inactive
                  <span className="badge-gray">{inactive.length}</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactive.map(evt => (
                  <EventTypeCard key={evt.id} event={evt} origin={origin} onEdit={() => {setEditing(evt); setShowModal(true)}} onDelete={() => handleDelete(evt.id)} />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {showModal && (
        <EventTypeModal
          event={editing}
          onClose={() => setShowModal(false)}
          onSave={async (savedEvent, isEdit) => {
            setShowModal(false);
            await load();
            if (!isEdit && savedEvent?.slug) {
              router.push(`/book/${savedEvent.slug}`);
            }
          }}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
