'use client';
/**
 * Settings Page
 * Comprehensive settings panel with profile, timezone, preferences, and danger zone sections.
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';

const PROFILE_STORAGE_KEY = 'slotsync_profile_v1';
const PREFS_STORAGE_KEY = 'slotsync_prefs_v1';

const DEFAULT_PROFILE = {
  name: 'Default User',
  email: 'user@slotsync.com',
  role: 'Admin',
};

const DEFAULT_PREFS = {
  emailNotifications: true,
  autoConfirm: false,
  bufferTime: 0,
  minNotice: 60,
};

const TIMEZONES = [
  'Asia/Kolkata','Asia/Dubai','Asia/Singapore','Asia/Tokyo',
  'Europe/London','Europe/Paris','Europe/Berlin',
  'America/New_York','America/Chicago','America/Denver',
  'America/Los_Angeles','America/Sao_Paulo',
  'Australia/Sydney','Pacific/Auckland',
];

export default function SettingsPage() {
  const [timezone, setTimezone]   = useState('Asia/Kolkata');
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');
  const [dangerLoading, setDangerLoading] = useState(false);
  const [dangerNotice, setDangerNotice] = useState('');

  // Profile
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  // Preferences
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError('');
      const settings = await api.getSettings();
      if (settings?.timezone) setTimezone(settings.timezone);

      const rawProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      const rawPrefs = localStorage.getItem(PREFS_STORAGE_KEY);
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile);
        if (parsed?.name && parsed?.email) {
          setProfile({ ...DEFAULT_PROFILE, ...parsed });
        }
      }
      if (rawPrefs) {
        const parsed = JSON.parse(rawPrefs);
        if (parsed && typeof parsed === 'object') {
          setPrefs({ ...DEFAULT_PREFS, ...parsed });
        }
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true); setSuccess(false); setError('');
    try {
      if (!profile.name.trim()) {
        throw new Error('Display Name is required');
      }
      if (!/^\S+@\S+\.\S+$/.test(profile.email)) {
        throw new Error('Please enter a valid email address');
      }

      await api.updateSettings({ timezone });
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const handleDeleteAllData = async () => {
    const confirmed = confirm('Delete all event types and related bookings? This action cannot be undone.');
    if (!confirmed) return;

    setDangerLoading(true);
    setDangerNotice('');
    setError('');

    try {
      const events = await api.getEventTypes();
      if (!events.length) {
        setDangerNotice('No event types found.');
        return;
      }

      const results = await Promise.allSettled(events.map((event) => api.deleteEventType(event.id)));
      const failed = results.filter((result) => result.status === 'rejected').length;

      if (failed > 0) {
        setDangerNotice(`${events.length - failed} deleted, ${failed} failed.`);
      } else {
        setDangerNotice('All event types deleted successfully.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDangerLoading(false);
      setTimeout(() => setDangerNotice(''), 3500);
    }
  };

  if (loading) return (
    <div className="p-8">
      <div className="skeleton h-8 max-w-sm mb-8" />
      <div className="space-y-6 max-w-3xl">
        {[1,2,3].map(i => <div key={i} className="skeleton h-40 w-full" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-full flex flex-col bg-slate-50/40">

      {/* Header */}
      <div className="page-header !border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Account</p>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <div className="flex items-center gap-3">
            {success && (
              <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Saved
              </span>
            )}
            <button onClick={handleSave} disabled={saving} className="btn-primary rounded-xl px-5 py-2.5">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto space-y-4">

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-fade-in">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <span>{error}</span>
            </div>
          )}

          {/* ── Profile Section ── */}
          <div className="card p-6 animate-fade-in-up rounded-2xl border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-400">Your personal information</p>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                {profile.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <span className="badge-purple mt-2">{profile.role}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Display Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile(p => ({...p, name: e.target.value}))}
                  className="field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile(p => ({...p, email: e.target.value}))}
                  className="field"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>

          {/* ── Timezone Section ── */}
          <div className="card p-6 animate-fade-in-up stagger-1 rounded-2xl border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Timezone</h2>
                <p className="text-sm text-gray-400">Times shown to clients will be auto-converted</p>
              </div>
            </div>
            <div className="max-w-sm">
              <select value={timezone} onChange={e => setTimezone(e.target.value)} className="select-field">
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>

          {/* ── Scheduling Preferences ── */}
          <div className="card p-6 animate-fade-in-up stagger-2 rounded-2xl border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Scheduling Preferences</h2>
                <p className="text-sm text-gray-400">Control how people can book with you</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Buffer Time */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/70 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Buffer time between events</p>
                  <p className="text-xs text-gray-400 mt-0.5">Add padding between consecutive meetings</p>
                </div>
                <select
                  value={prefs.bufferTime}
                  onChange={e => setPrefs(p => ({...p, bufferTime: Number(e.target.value)}))}
                  className="select-field !w-40"
                >
                  <option value={0}>No buffer</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>

              {/* Min Notice */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/70 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Minimum scheduling notice</p>
                  <p className="text-xs text-gray-400 mt-0.5">Prevent last-minute bookings</p>
                </div>
                <select
                  value={prefs.minNotice}
                  onChange={e => setPrefs(p => ({...p, minNotice: Number(e.target.value)}))}
                  className="select-field !w-40"
                >
                  <option value={0}>No minimum</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={240}>4 hours</option>
                  <option value={1440}>24 hours</option>
                </select>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-slate-50/70 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email notifications</p>
                  <p className="text-xs text-gray-400 mt-0.5">Receive emails when events are booked or cancelled</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrefs(p => ({...p, emailNotifications: !p.emailNotifications}))}
                  className={`toggle-track ${prefs.emailNotifications ? 'bg-[#0066FF]' : 'bg-gray-300'}`}
                >
                  <span className={`toggle-thumb ${prefs.emailNotifications ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              {/* Auto Confirm */}
              <div className="flex items-center justify-between p-4 bg-slate-50/70 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Auto-confirm bookings</p>
                  <p className="text-xs text-gray-400 mt-0.5">Automatically accept all incoming booking requests</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrefs(p => ({...p, autoConfirm: !p.autoConfirm}))}
                  className={`toggle-track ${prefs.autoConfirm ? 'bg-[#0066FF]' : 'bg-gray-300'}`}
                >
                  <span className={`toggle-thumb ${prefs.autoConfirm ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Danger Zone ── */}
          <div className="card p-6 border-red-100 animate-fade-in-up stagger-3 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Danger Zone</h2>
                <p className="text-sm text-gray-400">Irreversible and destructive actions</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-red-50/50 border border-red-100 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-900">Delete all event types</p>
                <p className="text-xs text-gray-500 mt-0.5">This will permanently remove all your event types and scheduled bookings.</p>
                {dangerNotice && <p className="text-xs font-semibold text-red-600 mt-2">{dangerNotice}</p>}
              </div>
              <button onClick={handleDeleteAllData} disabled={dangerLoading} className="btn-danger flex-shrink-0 text-xs rounded-xl">
                {dangerLoading ? 'Deleting...' : 'Delete All Data'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
