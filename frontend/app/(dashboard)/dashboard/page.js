'use client';
// Dashboard — Calendly-style Event Types page

import { useState, useEffect } from 'react';
import * as api from '@/lib/api';
import EventTypeCard  from '@/components/EventTypeCard';
import EventTypeModal from '@/components/EventTypeModal';

export default function DashboardPage() {
  const [eventTypes,   setEventTypes]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showModal,    setShowModal]    = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [error,        setError]        = useState('');
  const [origin,       setOrigin]       = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getEventTypes();
      setEventTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event type? All its bookings will also be removed.')) return;
    try {
      await api.deleteEventType(id);
      setEventTypes(p => p.filter(e => e.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const openNew    = ()      => { setEditingEvent(null);  setShowModal(true); };
  const openEdit   = (event) => { setEditingEvent(event); setShowModal(true); };
  const closeModal = ()      => { setShowModal(false); setEditingEvent(null); };
  const afterSave  = ()      => { load(); closeModal(); };

  const active   = eventTypes.filter(e => e.is_active);
  const inactive = eventTypes.filter(e => !e.is_active);

  return (
    <div className="min-h-full">

      {/* ── Page Header ───────────────────────── */}
      <div className="px-8 pt-8 pb-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create events · share links ·{' '}
              <span className="text-[#006BFF] font-mono font-medium text-xs">
                {origin}/book/…
              </span>
            </p>
          </div>
          <button id="btn-new-event-type" onClick={openNew} className="btn-primary flex-shrink-0">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Event Type
          </button>
        </div>
      </div>

      {/* ── Content ───────────────────────────── */}
      <div className="px-8 py-8 max-w-5xl mx-auto">

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            {error}
          </div>
        )}

        {/* Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-6 space-y-4">
                <div className="w-4 h-4 rounded-full skeleton" />
                <div>
                  <div className="h-5 w-3/4 skeleton mb-2" />
                  <div className="h-4 w-1/2 skeleton" />
                </div>
                <div className="h-px bg-gray-100" />
                <div className="h-4 w-1/3 skeleton" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && eventTypes.length === 0 && (
          <div className="text-center py-28">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg width="36" height="36" fill="none" stroke="#006BFF" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Create your first event type</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Add event types to allow people to schedule time with you. Share the link and let them pick a slot.
            </p>
            <button onClick={openNew} className="btn-primary mx-auto">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create Event Type
            </button>
          </div>
        )}

        {/* Active + Inactive sections */}
        {!loading && eventTypes.length > 0 && (
          <div className="space-y-10">
            {active.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active</p>
                  <span className="badge-blue">{active.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {active.map(event => (
                    <EventTypeCard
                      key={event.id}
                      event={event}
                      onEdit={() => openEdit(event)}
                      onDelete={() => handleDelete(event.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {inactive.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inactive</p>
                  <span className="badge-gray">{inactive.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-70">
                  {inactive.map(event => (
                    <EventTypeCard
                      key={event.id}
                      event={event}
                      onEdit={() => openEdit(event)}
                      onDelete={() => handleDelete(event.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <EventTypeModal event={editingEvent} onClose={closeModal} onSave={afterSave} />
      )}
    </div>
  );
}
