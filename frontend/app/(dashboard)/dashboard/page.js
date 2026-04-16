'use client';
/**
 * Main Dashboard Page
 * Displays an overview of user statistics and a list of active event types.
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';
import EventTypeCard  from '@/components/EventTypeCard';
import EventTypeModal from '@/components/EventTypeModal';

export default function DashboardPage() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [origin,     setOrigin]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setEventTypes(await api.getEventTypes()); } catch(e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { setOrigin(window.location.origin); load(); }, [load]);

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
      <div className="page-header">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dashboard</p>
            <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn-primary rounded-full px-6">
            + New Event Type
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-8 py-8 bg-gray-50/50">
        <div className="max-w-5xl mx-auto space-y-10">

          {origin && (
            <div className="card p-4 flex items-center justify-between gap-4 overflow-hidden">
              <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                <span className="truncate">{origin}/book/<span className="text-gray-400">slug</span></span>
              </div>
            </div>
          )}

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="skeleton h-48 w-full" />)}
            </div>
          )}

          {!loading && eventTypes.length === 0 && (
            <div className="text-center py-24 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 text-[#006BFF] rounded-full flex items-center justify-center mb-6">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You don't have any event types yet.</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto text-[15px]">
                You'll want to add at least one event type to allow people to schedule with you. Let's get started.
              </p>
              <button onClick={() => setShowModal(true)} className="btn-primary rounded-full px-8 py-3">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline mr-2 -mt-0.5"><path d="M12 5v14M5 12h14"/></svg>
                New Event Type
              </button>
            </div>
          )}

          {!loading && active.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  Active
                  <span className="badge-blue">{active.length}</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {active.map(evt => (
                  <EventTypeCard key={evt.id} event={evt} origin={origin} onEdit={() => {setEditing(evt); setShowModal(true)}} onDelete={() => handleDelete(evt.id)} />
                ))}
              </div>
            </section>
          )}

          {!loading && inactive.length > 0 && (
            <section className="opacity-75">
               <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  Inactive
                  <span className="badge-gray">{inactive.length}</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
