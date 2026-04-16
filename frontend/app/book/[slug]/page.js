'use client';
/**
 * Public Booking Page
 * Allows external users to select dates and times to book meetings based on event type availability.
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Calendar       from '@/components/Calendar';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import * as api       from '@/lib/api';
import { formatDate, generateTimeSlots } from '@/lib/utils';

export default function BookingPage() {
  const { slug } = useParams();
  const router   = useRouter();

  const [eventType,    setEventType]    = useState(null);
  const [availability, setAvailability] = useState([]);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [step,         setStep]         = useState(1); // 1 = dateTime, 2 = form
  
  const [slots,        setSlots]        = useState([]);
  const [form,         setForm]         = useState({ name: '', email: '', notes: '' });

  const [pageLoading,  setPageLoading]  = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');
  const [pageError,    setPageError]    = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [et, avail] = await Promise.all([api.getEventTypeBySlug(slug), api.getAvailability()]);
        if (!et.is_active) { setPageError('This booking link is currently inactive.'); return; }
        setEventType(et); setAvailability(avail);
      } catch (err) { setPageError(err.message); } finally { setPageLoading(false); }
    };
    load();
  }, [slug]);

  const handleDateSelect = async (date) => {
    setSelectedDate(date); setSelectedTime(null); setSlots([]); setSlotsLoading(true); setError('');
    try {
      const { slots: booked } = await api.getBookedSlots(date);
      const dow = new Date(date + 'T12:00:00').getDay();
      const config = availability.find(a => a.day_of_week === dow);
      if (!config || !config.is_available) { setSlots([]); return; }
      setSlots(generateTimeSlots(String(config.start_time).substring(0, 5), String(config.end_time).substring(0, 5), eventType.duration_minutes, booked));
    } catch (err) { setError(err.message); } finally { setSlotsLoading(false); }
  };

  const handleTimeSelect = (time, confirm = false) => {
    setSelectedTime(time);
    if (confirm) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setError('');
    try {
      await api.createBooking({ ...form, event_type_id: eventType.id, date: selectedDate, time: selectedTime });
      const params = new URLSearchParams({ name: form.name, email: form.email, event: eventType.title, date: selectedDate, time: selectedTime, duration: eventType.duration_minutes });
      router.push(`/book/${slug}/confirmation?${params}`);
    } catch (err) { setError(err.message); setSubmitting(false); }
  };

  if (pageLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
      <div className="spinner-blue" />
      <p className="text-sm text-gray-400 mt-4 font-medium">Loading booking page...</p>
    </div>
  );

  if (pageError || !eventType) return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-6">
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg width="32" height="32" fill="none" stroke="#EF4444" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Unavailable</h1>
        <p className="text-gray-500 max-w-sm">{pageError || 'Event not found.'}</p>
      </div>
    </div>
  );

  const fmtTime = (t) => new Date(`2000-01-01T${t}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4 sm:p-6 lg:p-8">

      {/* Container */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/30 border border-gray-100 flex flex-col md:flex-row w-full max-w-[1060px] min-h-[600px] overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div className="w-full md:w-[360px] bg-white border-b md:border-b-0 md:border-r border-gray-100 p-8 flex flex-col pt-10">

          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all mb-6"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">D</div>
            <p className="text-sm font-bold text-gray-400">Default User</p>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-6">{eventType.title}</h1>

          <div className="space-y-4 text-sm font-semibold text-gray-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              {eventType.duration_minutes} min
            </div>

            {step === 2 && (
              <div className="flex items-center gap-3 text-[#0066FF]">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div className="flex flex-col">
                  <span>{fmtTime(selectedTime)} – {fmtTime(new Date(new Date(`2000-01-01T${selectedTime}`).getTime() + eventType.duration_minutes*60000).toTimeString().substring(0,5))}</span>
                  <span className="text-gray-400 font-medium">{formatDate(selectedDate)}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l4.55 4.55a1 1 0 01-1.41 1.41L13.6 11.41a1 1 0 011.41-1.41z"/><rect x="4" y="6" width="10" height="12" rx="2"/></svg>
              </div>
              <span className="text-gray-400 font-medium">Web conferencing details upon confirmation</span>
            </div>
          </div>

          {eventType.description && (
            <p className="text-sm text-gray-500 mt-6 pt-6 border-t border-gray-50 leading-relaxed whitespace-pre-wrap">
              {eventType.description}
            </p>
          )}

        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 bg-white p-8 md:p-10 relative">

          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 shadow-sm flex gap-2 z-10 animate-fade-in">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Picker */
            <div className="h-full flex flex-col pt-2 md:pt-0 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Select a Date & Time</h2>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
                <div className="flex-1">
                  <Calendar availability={availability} selectedDate={selectedDate} onDateSelect={handleDateSelect} />
                </div>

                {selectedDate && (
                  <div className="w-full lg:w-[240px] animate-slide-in-right">
                    <p className="text-[15px] font-bold text-gray-900 mb-4 h-[32px] flex items-center">
                      {formatDate(selectedDate)}
                    </p>
                    <TimeSlotPicker slots={slots} selectedTime={selectedTime} onSelect={handleTimeSelect} loading={slotsLoading} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* STEP 2: Form */
            <div className="h-full max-w-[440px] animate-slide-in-right pt-2 md:pt-0">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Enter Details</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="field" autoFocus />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="field" />
                </div>
                <div>
                  <label className="label">Notes for host</label>
                  <textarea rows={4} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="field resize-none" />
                </div>
                <div className="text-xs text-gray-400 pt-2 pb-4">
                  By proceeding, you confirm that you have read and agree to SlotSync&apos;s Terms of Use.
                </div>
                <button type="submit" disabled={submitting} className="btn-primary rounded-full px-8 py-3.5 text-[15px]">
                  {submitting ? (
                    <><span className="spinner" /> Scheduling...</>
                  ) : (
                    'Schedule Event'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
