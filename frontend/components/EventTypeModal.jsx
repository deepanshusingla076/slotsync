'use client';
/**
 * EventTypeModal Component
 * Modal interface for creating and editing event types.
 */

import { useState, useEffect, useRef } from 'react';
import * as api from '@/lib/api';

const COLORS = ['#006BFF', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'];
const QUICK_DURATIONS = [15, 30, 45, 60];

export default function EventTypeModal({ event, onClose, onSave }) {
  const isEdit = !!event;
  const titleRef = useRef(null);

  const [form, setForm] = useState({
    title:            event?.title            || '',
    description:      event?.description      || '',
    duration_minutes: event?.duration_minutes || 30,
    color:            event?.color            || '#006BFF',
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
      isEdit ? await api.updateEventType(event.id, form) : await api.createEventType(form);
      onSave();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
         onClick={e => e.target === e.currentTarget && onClose()}>
      
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200 bg-gray-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-[#006BFF] rounded-xl flex items-center justify-center">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {isEdit ? 'Edit Event Type' : 'New Event Type'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">Define your meeting rules</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 space-y-6 overflow-y-auto">
          
          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="label">Event Name *</label>
            <input
              ref={titleRef}
              type="text" required
              value={form.title} onChange={e => set('title', e.target.value)}
              className="field"
              placeholder="e.g. 30 Minute Meeting"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              rows={3}
              value={form.description} onChange={e => set('description', e.target.value)}
              className="field resize-none"
              placeholder="Instructions or agenda for the meeting..."
            />
          </div>

          <div>
            <label className="label">Duration *</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {QUICK_DURATIONS.map(d => (
                <button
                  key={d} type="button" onClick={() => set('duration_minutes', d)}
                  className={`py-2 rounded-lg text-sm font-semibold transition-colors border ${
                    form.duration_minutes === d ? 'bg-blue-50 text-[#006BFF] border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
            <div className="flex items-center">
              <input
                type="number" min="5" max="480"
                value={form.duration_minutes} onChange={e => set('duration_minutes', parseInt(e.target.value) || 30)}
                className="field !rounded-r-none border-r-0"
              />
              <span className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-r-lg text-gray-500 text-sm font-medium">
                minutes
              </span>
            </div>
          </div>

          <div>
            <label className="label">Event Color</label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c} type="button" onClick={() => set('color', c)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    form.color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {isEdit && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-900 cursor-pointer select-none" onClick={() => set('is_active', !form.is_active)}>
                Turn on my booking page
              </label>
              <button
                type="button" onClick={() => set('is_active', !form.is_active)}
                className={`toggle-track ${form.is_active ? 'bg-blue-600' : 'bg-gray-200'}`} aria-checked={form.is_active}
              >
                <span className={`toggle-thumb ${form.is_active ? 'translate-x-[22px]' : ''}`} />
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
