'use client';
// app/(dashboard)/dashboard/page.js
// Event Types dashboard — lists all event types, supports create/edit/delete.

import { useState, useEffect } from 'react';
import * as api from '@/lib/api';
import EventTypeCard  from '@/components/EventTypeCard';
import EventTypeModal from '@/components/EventTypeModal';

export default function DashboardPage() {
  const [eventTypes,   setEventTypes]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [showModal,    setShowModal]    = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null = creating new

  // ── Fetch all event types ──────────────────────
  const fetchEventTypes = async () => {
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

  useEffect(() => { fetchEventTypes(); }, []);

  // ── Handlers ──────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('Delete this event type? All its bookings will also be removed.')) return;
    try {
      await api.deleteEventType(id);
      setEventTypes(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const openEdit  = (event) => { setEditingEvent(event); setShowModal(true); };
  const openNew   = ()      => { setEditingEvent(null);  setShowModal(true); };
  const closeModal = ()     => { setShowModal(false); setEditingEvent(null); };
  const afterSave  = ()     => { fetchEventTypes(); closeModal(); };

  // ── Render ────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Event Types</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create events and share the booking link with your invitees.
          </p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Event Type
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty state */}
      {eventTypes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No event types yet</h3>
          <p className="text-gray-500 text-sm mb-6">Create your first event type to start accepting bookings.</p>
          <button onClick={openNew} className="btn-primary">
            + New Event Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventTypes.map(event => (
            <EventTypeCard
              key={event.id}
              event={event}
              onEdit={() => openEdit(event)}
              onDelete={() => handleDelete(event.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <EventTypeModal
          event={editingEvent}
          onClose={closeModal}
          onSave={afterSave}
        />
      )}
    </div>
  );
}

// Skeleton loader while fetching
function LoadingSkeleton() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-36 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="card overflow-hidden">
            <div className="h-1.5 bg-gray-200" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
