'use client';
// app/book/[slug]/page.js
// Public booking page — no login required.
// Flow: Calendar → Time Slots → Booking Form → Confirmation

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Calendar       from '@/components/Calendar';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import * as api       from '@/lib/api';
import { formatDate, generateTimeSlots } from '@/lib/utils';

export default function BookingPage() {
  const { slug } = useParams();
  const router   = useRouter();

  // ── Server data ────────────────────────────────
  const [eventType,    setEventType]    = useState(null);
  const [availability, setAvailability] = useState([]);

  // ── User selections ────────────────────────────
  const [selectedDate, setSelectedDate] = useState(null);  // "YYYY-MM-DD"
  const [selectedTime, setSelectedTime] = useState(null);  // "HH:MM"
  const [slots,        setSlots]        = useState([]);

  // ── Form ───────────────────────────────────────
  const [form, setForm] = useState({ name: '', email: '', notes: '' });

  // ── UI state ───────────────────────────────────
  const [pageLoading,  setPageLoading]  = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');
  const [pageError,    setPageError]    = useState('');

  // ── Load event type + availability ────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [et, avail] = await Promise.all([
          api.getEventTypeBySlug(slug),
          api.getAvailability(),
        ]);
        if (!et.is_active) {
          setPageError('This event type is no longer accepting bookings.');
          return;
        }
        setEventType(et);
        setAvailability(avail);
      } catch (err) {
        setPageError(err.message);
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [slug]);

  // ── When date selected, load time slots ────────
  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSlots([]);
    setSlotsLoading(true);
    setError('');

    try {
      const { slots: bookedTimes } = await api.getBookedSlots(date);

      const dow      = new Date(date + 'T12:00:00').getDay();
      const dayAvail = availability.find(a => a.day_of_week === dow);

      if (!dayAvail || !dayAvail.is_available) {
        setSlots([]);
        return;
      }

      // MySQL TIME: "09:00:00" → trim to "09:00"
      const trim = (t) => String(t).substring(0, 5);
      const generated = generateTimeSlots(
        trim(dayAvail.start_time),
        trim(dayAvail.end_time),
        eventType.duration_minutes,
        bookedTimes
      );
      setSlots(generated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSlotsLoading(false);
    }
  };

  // ── Reset to calendar ─────────────────────────
  const resetDate = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSlots([]);
    setError('');
  };

  // ── Reset to time slots ───────────────────────
  const resetTime = () => {
    setSelectedTime(null);
    setError('');
  };

  // ── Submit booking ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.createBooking({
        name:          form.name,
        email:         form.email,
        event_type_id: eventType.id,
        date:          selectedDate,
        time:          selectedTime,
        notes:         form.notes,
      });

      const params = new URLSearchParams({
        name:     form.name,
        email:    form.email,
        event:    eventType.title,
        date:     selectedDate,
        time:     selectedTime,
        duration: eventType.duration_minutes,
      });
      router.push(`/book/${slug}/confirmation?${params}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  // ── Loading screen ─────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
          <p className="text-sm text-gray-500">Loading booking page…</p>
        </div>
      </div>
    );
  }

  // ── Error / not found screen ───────────────────
  if (pageError || !eventType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" fill="none" stroke="#EF4444" strokeWidth="1.75" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-500 text-sm mb-6">
            {pageError || 'This booking link may be invalid or the event type has been removed.'}
          </p>
          <a href="/" className="btn-primary">Go Home</a>
        </div>
      </div>
    );
  }

  // ── Format time helper ─────────────────────────
  const fmtTime = (t) => new Date(`2000-01-01T${t}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-white lg:flex">

      {/* ══ LEFT PANEL — Event Info ═══════════════ */}
      <aside className="lg:w-80 xl:w-96 bg-gray-50 border-r border-gray-200 lg:min-h-screen p-8 lg:p-10 flex flex-col">

        {/* Brand */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-[#006BFF] rounded-md flex items-center justify-center">
            <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900">SlotSync</span>
        </div>

        {/* Host avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006BFF] to-[#0052CC] flex items-center justify-center text-white text-lg font-bold mb-4 shadow-sm">
          D
        </div>
        <p className="text-sm text-gray-500 mb-1">Default User</p>

        {/* Colour dot + Event title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: eventType.color }} />
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{eventType.title}</h1>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
          </svg>
          <span>{eventType.duration_minutes} minutes</span>
        </div>

        {/* Meeting type */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.868V15.13a1 1 0 0 1-1.447.899L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
          </svg>
          <span>Web conference</span>
        </div>

        {/* Description */}
        {eventType.description && (
          <p className="text-sm text-gray-500 leading-relaxed mt-5 pt-5 border-t border-gray-200">
            {eventType.description}
          </p>
        )}

        {/* Selected slot summary pill */}
        {selectedDate && (
          <div className="mt-auto pt-8">
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Selected</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(selectedDate + 'T12:00:00')}
              </p>
              {selectedTime && (
                <p className="text-sm text-[#006BFF] font-semibold mt-0.5">
                  {fmtTime(selectedTime)} · {eventType.duration_minutes} min
                </p>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* ══ RIGHT PANEL — Booking Flow ════════════ */}
      <main className="flex-1 p-8 lg:p-12 xl:p-16">

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            {error}
          </div>
        )}

        {/* ── STEP 1: Calendar ─────────────────── */}
        {!selectedDate && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Select a Date &amp; Time</h2>
            <p className="text-sm text-gray-500 mb-8">Choose a date to see available time slots.</p>
            <Calendar
              availability={availability}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        )}

        {/* ── STEP 2: Time Slots ───────────────── */}
        {selectedDate && !selectedTime && (
          <div>
            {/* Back to calendar */}
            <button
              onClick={resetDate}
              className="flex items-center gap-1.5 text-sm text-[#006BFF] hover:text-blue-700 font-medium mb-6 group"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                className="group-hover:-translate-x-0.5 transition-transform">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              {formatDate(selectedDate + 'T12:00:00')}
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Select a Time</h2>
            <p className="text-sm text-gray-500 mb-6">All times shown in your local timezone.</p>

            <TimeSlotPicker
              slots={slots}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
              loading={slotsLoading}
            />
          </div>
        )}

        {/* ── STEP 3: Booking Form ─────────────── */}
        {selectedDate && selectedTime && (
          <div className="max-w-sm">
            {/* Back to time slots */}
            <button
              onClick={resetTime}
              className="flex items-center gap-1.5 text-sm text-[#006BFF] hover:text-blue-700 font-medium mb-6 group"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                className="group-hover:-translate-x-0.5 transition-transform">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              {fmtTime(selectedTime)}
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Enter Details</h2>
            <p className="text-sm text-gray-500 mb-6">Tell us a bit about yourself before we confirm your booking.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  className="input-field"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Anything you'd like to share before the meeting?"
                  className="input-field resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-base mt-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Confirming…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Confirm Booking
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
