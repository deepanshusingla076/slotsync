'use client';
/**
 * EventTypeModal Component
 * Modal interface for creating and editing event types with a clean, professional design.
 */

import { useState, useEffect, useRef } from 'react';
import * as api from '@/lib/api';

const COLORS = ['#0066FF', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'];

export default function EventTypeModal({ event, onClose, onSave }) {
  const isEdit = !!event;
  const titleRef = useRef(null);

  const [form, setForm] = useState({
    title:            event?.title            || '',
    description:      event?.description      || '',
    duration_minutes: event?.duration_minutes || 30,
    color:            event?.color            || '#0066FF',
    is_active:        event?.is_active !== undefined ? Boolean(event.is_active) : true,
  });

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  useEffect(() => { setTimeout(() => titleRef.current?.focus(), 60); }, []);
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Event name is required'); return; }
    if (!form.duration_minutes || form.duration_minutes < 5) { setError('Minimum duration is 5 minutes'); return; }

    setSaving(true); setError('');
    try {
      const savedEvent = isEdit
        ? await api.updateEventType(event.id, form)
        : await api.createEventType(form);
      onSave(savedEvent, isEdit);
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in"
         onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="bg-white w-full max-w-[560px] rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/30 flex flex-col max-h-[90vh] animate-fade-in-up">

        {/* Header */}
        <div className="px-7 py-6 flex items-start justify-between border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              {isEdit ? 'Edit Event Type' : 'New Event Type'}
            </h2>
            <p className="text-sm text-gray-500 mt-1.5">Configure your event details and booking settings</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200/70 transition-all">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-7 space-y-6 overflow-y-auto">

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="label">Event Name *</label>
              <input
                ref={titleRef}
                type="text" required
                value={form.title} onChange={e => set('title', e.target.value)}
                className="field"
                placeholder="e.g. Discovery Call, Coffee Chat"
              />
              <p className="text-xs text-gray-400 mt-1.5">This appears on your public booking page.</p>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                rows={4}
                value={form.description} onChange={e => set('description', e.target.value)}
                className="field resize-none"
                placeholder="Add details like meeting links or agendas..."
              />
            </div>

            <div className="flex gap-5">
              <div className="flex-1">
                <label className="label">Duration (minutes) *</label>
                <input
                  type="number" min="5" max="480"
                  value={form.duration_minutes} onChange={e => set('duration_minutes', parseInt(e.target.value) || 30)}
                  className="field"
                />
              </div>

              <div className="flex-1">
                <label className="label">Event Color</label>
                <div className="flex flex-wrap gap-2.5 pt-1.5 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  {COLORS.map(c => (
                    <button
                      key={c} type="button" onClick={() => set('color', c)}
                      className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 border border-white ${
                        form.color === c
                          ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 shadow-sm'
                          : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            {isEdit && (
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="text-sm font-semibold text-gray-700 cursor-pointer select-none" onClick={() => set('is_active', !form.is_active)}>
                  Event is active and bookable
                </label>
                <button
                  type="button" onClick={() => set('is_active', !form.is_active)}
                  className={`toggle-track ${form.is_active ? 'bg-[#0066FF]' : 'bg-gray-300'}`} aria-checked={form.is_active}
                >
                  <span className={`toggle-thumb ${form.is_active ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-5 mt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? (
                <><span className="spinner" /> Saving...</>
              ) : (
                isEdit ? 'Save Changes' : 'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
