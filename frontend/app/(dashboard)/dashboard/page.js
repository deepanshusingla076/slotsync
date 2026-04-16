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

  const searchParams = useSearchParams();
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    try { setEventTypes(await api.getEventTypes()); } catch(e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { setOrigin(window.location.origin); load(); }, [load]);

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
    } catch (e) { alert(e.message); }
  };

  const active   = eventTypes.filter(e => e.is_active);
  const inactive = eventTypes.filter(e => !e.is_active);

  return (
    <div className="min-h-full flex flex-col bg-white">

      {/* Header */}
      <div className="pt-8 pb-6 px-4 sm:px-8 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Event Types</h1>
            <p className="text-[15px] text-gray-500">Create events to share for people to book on your calendar</p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="bg-[#0066FF] hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
            <span>+</span> New Event Type
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 sm:px-8 py-8 bg-gray-50/30">
        <div className="max-w-5xl mx-auto space-y-10">

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="skeleton h-48 w-full" />)}
            </div>
          )}

          {!loading && eventTypes.length === 0 && (
            <div className="text-center py-24 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col items-center animate-fade-in-up">
              <div className="w-20 h-20 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mb-6">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No event types yet</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto text-[15px] leading-relaxed">
                Create your first event type to start receiving bookings from people.
              </p>
              <button onClick={() => setShowModal(true)} className="btn-primary rounded-full px-8 py-3">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                New Event Type
              </button>
            </div>
          )}

          {!loading && active.length > 0 && (
            <section className="animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {active.map(evt => (
                  <EventTypeCard key={evt.id} event={evt} origin={origin} onEdit={() => {setEditing(evt); setShowModal(true)}} onDelete={() => handleDelete(evt.id)} />
                ))}
                <button 
                  onClick={() => { setEditing(null); setShowModal(true); }}
                  className="flex flex-col items-center justify-center min-h-[180px] bg-white border border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900 shadow-sm"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mb-2 text-gray-400"><path d="M12 5v14M5 12h14"/></svg>
                  <span className="text-[14px] font-medium text-gray-600">New Event Type</span>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {inactive.map(evt => (
                  <EventTypeCard key={evt.id} event={evt} origin={origin} onEdit={() => {setEditing(evt); setShowModal(true)}} onDelete={() => handleDelete(evt.id)} />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {showModal && <EventTypeModal event={editing} onClose={() => setShowModal(false)} onSave={() => { load(); setShowModal(false); }} />}
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
