// lib/api.js
// -------------------------------------------------
// Central place for ALL API calls.
// Every page imports from here — no raw fetch()
// calls scattered across components.
// -------------------------------------------------

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Generic request helper
async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== null) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

// ── Event Types ──────────────────────────────────
export const getEventTypes        = ()         => request('GET',    '/event-types');
export const getEventTypeBySlug   = (slug)     => request('GET',    `/event-types/slug/${slug}`);
export const createEventType      = (data)     => request('POST',   '/event-types', data);
export const updateEventType      = (id, data) => request('PUT',    `/event-types/${id}`, data);
export const deleteEventType      = (id)       => request('DELETE', `/event-types/${id}`);

// ── Availability ────────────────────────────────
export const getAvailability      = ()         => request('GET',  '/availability');
export const saveAvailability     = (data)     => request('POST', '/availability', data);

// ── Bookings ────────────────────────────────────
export const createBooking        = (data)     => request('POST', '/bookings', data);
export const getBookedSlots       = (date)     => request('GET',  `/bookings/slots?date=${date}`);

// ── Meetings ────────────────────────────────────
export const getUpcomingMeetings  = ()         => request('GET',    '/meetings/upcoming');
export const getPastMeetings      = ()         => request('GET',    '/meetings/past');
export const cancelMeeting        = (id)       => request('DELETE', `/meetings/${id}`);

// ── Settings ─────────────────────────────────────
export const getSettings          = ()         => request('GET', '/settings');
export const updateSettings       = (data)     => request('PUT', '/settings', data);

// ── Contact ──────────────────────────────────────
export const submitContact        = (data)     => request('POST', '/contact', data);
