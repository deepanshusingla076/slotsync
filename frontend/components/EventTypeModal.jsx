'use client';
// EventTypeModal — clean create/edit dialog

import { useState, useEffect, useRef } from 'react';
import * as api from '@/lib/api';

const COLORS = [
  '#006BFF','#10B981','#F59E0B','#EF4444',
  '#8B5CF6','#06B6D4','#EC4899','#F97316',
];

const DURATIONS = [15, 30, 45, 60];

export default function EventTypeModal({ event, onClose, onSave }) {
  const isEdit = !!event;
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    title:            event?.title            || '',
    description:      event?.description      || '',
    duration_minutes: event?.duration_minutes || 30,
    color:            event?.color            || '#006BFF',
    is_active:        event?.is_active !== undefined ? Boolean(event.is_active) : true,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  // Focus first input on open
  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Event name is required.'); return; }
    if (!form.duration_minutes || form.duration_minutes < 5) { setError('Duration must be at least 5 minutes.'); return; }

    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await api.updateEventType(event.id, form);
      } else {
        await api.createEventType(form);
      }
      onSave();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? 'Edit Event Type' : 'New Event Type'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEdit ? 'Update your event type details.' : 'Create a shareable booking link.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 max-h-[80vh] overflow-y-auto">

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="label">
              Event name <span className="text-red-400">*</span>
            </label>
            <input
              ref={firstInputRef}
              type="text"
              required
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. 30 Minute Meeting"
              className="input-field"
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Share what this meeting is about…"
              className="input-field resize-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="label">
              Duration <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set('duration_minutes', d)}
                  className={`py-2.5 text-sm font-semibold rounded-lg border-2 transition-all ${
                    form.duration_minutes === d
                      ? 'border-[#006BFF] bg-[#006BFF] text-white shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-[#006BFF] hover:text-[#006BFF]'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="480"
                value={form.duration_minutes}
                onChange={e => set('duration_minutes', parseInt(e.target.value) || 30)}
                placeholder="Custom minutes"
                className="input-field pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">min</span>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="label">Event colour</label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('color', c)}
                  className={`w-9 h-9 rounded-full transition-all hover:scale-110 ${
                    form.color === c
                      ? 'ring-2 ring-offset-2 ring-[#006BFF] scale-110'
                      : ''
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Active toggle — edit only */}
          {isEdit && (
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-900">Event status</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {form.is_active ? 'Accepting bookings' : 'Hidden from invitees'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => set('is_active', !form.is_active)}
                className={`toggle-track ${form.is_active ? 'bg-[#006BFF]' : 'bg-gray-300'}`}
                aria-label="Toggle active"
              >
                <span className={`toggle-thumb ${form.is_active ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : isEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
