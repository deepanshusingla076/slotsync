'use client';
// components/EventTypeModal.jsx
// Modal dialog for creating or editing an event type.

import { useState } from 'react';
import * as api from '@/lib/api';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#F97316'];
const QUICK_DURATIONS = [15, 30, 45, 60];

export default function EventTypeModal({ event, onClose, onSave }) {
  const isEdit = !!event;

  const [form, setForm] = useState({
    title:            event?.title            || '',
    description:      event?.description      || '',
    duration_minutes: event?.duration_minutes || 30,
    color:            event?.color            || '#2563EB',
    is_active:        event?.is_active !== undefined ? !!event.is_active : true,
  });

  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState('');

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } finally {
      setSaving(false);
    }
  };

  // Close when clicking outside the white box
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Event Type' : 'New Event Type'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text" required
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. 30 Min Meeting"
              className="input-field"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="What is this meeting about?"
              rows={2}
              className="input-field resize-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes) <span className="text-red-400">*</span>
            </label>
            {/* Quick-pick buttons */}
            <div className="flex gap-2 mb-2">
              {QUICK_DURATIONS.map(d => (
                <button
                  key={d} type="button"
                  onClick={() => set('duration_minutes', d)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    form.duration_minutes === d
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
            {/* Custom input */}
            <input
              type="number" min="5" max="480"
              value={form.duration_minutes}
              onChange={e => set('duration_minutes', parseInt(e.target.value) || 30)}
              placeholder="Custom (minutes)"
              className="input-field text-sm"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c} type="button"
                  onClick={() => set('color', c)}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                    form.color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Active toggle (only when editing) */}
          {isEdit && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => set('is_active', !form.is_active)}
                className={`toggle-track ${form.is_active ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`toggle-thumb ${form.is_active ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-gray-700">{form.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
