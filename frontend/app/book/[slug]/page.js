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
  const { slug }  = useParams();
  const router    = useRouter();

  // ── Server data ────────────────────────────────
  const [eventType,    setEventType]    = useState(null);
  const [availability, setAvailability] = useState([]);

  // ── User selections ────────────────────────────
  const [selectedDate, setSelectedDate] = useState(null);   // "YYYY-MM-DD"
  const [selectedTime, setSelectedTime] = useState(null);   // "HH:MM"
  const [slots,        setSlots]        = useState([]);

  // ── Form ───────────────────────────────────────
  const [form, setForm] = useState({ name: '', email: '', notes: '' });

  // ── UI state ───────────────────────────────────
  const [pageLoading,  setPageLoading]  = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');

  // ── Load event type + availability ────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [et, avail] = await Promise.all([
          api.getEventTypeBySlug(slug),
          api.getAvailability(),
        ]);
        setEventType(et);
        setAvailability(avail);
      } catch (err) {
        setError(err.message);
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [slug]);

  // ── When a date is selected, load booked slots ─
  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSlots([]);
    setSlotsLoading(true);

    try {
      const { slots: bookedTimes } = await api.getBookedSlots(date);

      // Find host's availability for this weekday
      // Use noon to safely avoid timezone issues when extracting getDay()
      const dow       = new Date(date + 'T12:00:00').getDay();
      const dayAvail  = availability.find(a => a.day_of_week === dow);

      if (!dayAvail || !dayAvail.is_available) {
        setSlots([]);
        return;
      }

      // MySQL TIME: "09:00:00" → trim to "09:00"
      const trim  = (t) => String(t).substring(0, 5);
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

      // Redirect to confirmation with booking details as query params
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

  // ── Loading / error screens ────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  if (!eventType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Event not found</h1>
          <p className="text-gray-500 text-sm">This booking link may be invalid or inactive.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white lg:flex">

      {/* ── LEFT PANEL: Event Info ──────────────── */}
      <div className="lg:w-80 xl:w-96 bg-gray-50 border-r border-gray-200 p-8 lg:p-10">

        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <span className="font-semibold text-gray-800">SlotSync</span>
        </div>

        {/* Event color dot */}
        <div className="w-4 h-4 rounded-full mb-5" style={{ backgroundColor: eventType.color }} />

        {/* Host */}
        <p className="text-sm text-gray-500 mb-1">Default User</p>

        {/* Event title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{eventType.title}</h1>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
          </svg>
          <span>{eventType.duration_minutes} minutes</span>
        </div>

        {/* Description */}
        {eventType.description && (
          <p className="text-sm text-gray-500 leading-relaxed mt-4 border-t border-gray-200 pt-4">
            {eventType.description}
          </p>
        )}

        {/* Selected slot summary */}
        {selectedDate && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Selected</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(selectedDate + 'T12:00:00')}
            </p>
            {selectedTime && (
              <p className="text-sm text-blue-600 font-medium mt-0.5">
                {new Date(`2000-01-01T${selectedTime}:00`).toLocaleTimeString('en-US', {
                  hour: 'numeric', minute: '2-digit'
                })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL: Booking Flow ───────────── */}
      <div className="flex-1 p-8 lg:p-12">

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* STEP 1: Calendar */}
        {!selectedDate && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Select a date</h2>
            <Calendar
              availability={availability}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        )}

        {/* STEP 2 + 3: Slots + Form side by side */}
        {selectedDate && (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Time slots column */}
            <div className="lg:w-56">
              <button
                onClick={() => { setSelectedDate(null); setSelectedTime(null); setSlots([]); }}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mb-5"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                {formatDate(selectedDate + 'T12:00:00')}
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a time</h2>
              <TimeSlotPicker
                slots={slots}
                selectedTime={selectedTime}
                onSelect={setSelectedTime}
                loading={slotsLoading}
              />
            </div>

            {/* Booking form — slides in when time is selected */}
            {selectedTime && (
              <div className="flex-1 max-w-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Your details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" required
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Your full name"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-400">*</span>
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
                      Additional notes
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
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Confirming…
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>

                </form>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
