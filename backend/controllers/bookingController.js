// controllers/bookingController.js
// -------------------------------------------------
// POST /bookings
//
// Step-by-step booking logic:
//   1. Validate all input fields
//   2. Fetch the event type (need duration)
//   3. Calculate start_time and end_time as DATETIME
//   4. Get availability for that day of the week
//   5. Check the day is marked as available
//   6. Check the slot falls within working hours
//   7. Check for overlapping confirmed bookings
//   8. Insert the booking into the DB
// -------------------------------------------------

const bookingModel    = require('../models/bookingModel');
const eventTypeModel  = require('../models/eventTypeModel');
const availabilityModel = require('../models/availabilityModel');

// Helper: parse "HH:MM" string into total minutes for easy comparison
const toMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const createBooking = async (req, res) => {
  try {
    const { name, email, event_type_id, date, time, notes } = req.body;

    // ── Step 1: Validate input ────────────────────────────────
    if (!name || !email || !event_type_id || !date || !time) {
      return res.status(400).json({ error: 'name, email, event_type_id, date, and time are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid date. Use format YYYY-MM-DD' });
    }

    // Validate time format (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return res.status(400).json({ error: 'Invalid time. Use format HH:MM (e.g. 10:00)' });
    }

    // ── Step 2: Fetch the event type ─────────────────────────
    const eventType = await eventTypeModel.getById(event_type_id);
    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    if (!eventType.is_active) {
      return res.status(400).json({ error: 'This event type is no longer active' });
    }

    // ── Step 3: Build DATETIME strings ───────────────────────
    // MySQL DATETIME format: "YYYY-MM-DD HH:MM:SS"
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime   = new Date(startDateTime.getTime() + eventType.duration_minutes * 60 * 1000);

    const start_time = startDateTime.toISOString().slice(0, 19).replace('T', ' ');
    const end_time   = endDateTime.toISOString().slice(0, 19).replace('T', ' ');

    // Don't allow bookings in the past
    if (startDateTime < new Date()) {
      return res.status(400).json({ error: 'Cannot book a slot in the past' });
    }

    // ── Step 4: Get availability for this weekday ─────────────
    // getDay() returns 0 (Sun) to 6 (Sat) — matches our DB schema
    const dayOfWeek = startDateTime.getDay();
    const availability = await availabilityModel.getByDay(dayOfWeek);

    // ── Step 5: Check the day is available ───────────────────
    if (!availability || !availability.is_available) {
      return res.status(400).json({ error: 'The host is not available on this day' });
    }

    // ── Step 6: Check the slot is within working hours ───────
    // Convert everything to minutes for simple number comparison
    const slotStartMinutes = toMinutes(time);
    const slotEndMinutes   = slotStartMinutes + eventType.duration_minutes;
    const workStart        = toMinutes(availability.start_time);
    const workEnd          = toMinutes(availability.end_time);

    if (slotStartMinutes < workStart || slotEndMinutes > workEnd) {
      return res.status(400).json({
        error: `Slot must be within working hours: ${availability.start_time} – ${availability.end_time}`
      });
    }

    // ── Step 7: Check for overlapping bookings ───────────────
    const conflict = await bookingModel.hasOverlap(start_time, end_time);
    if (conflict) {
      return res.status(409).json({ error: 'This time slot is already booked. Please choose another.' });
    }

    // ── Step 8: Save the booking ─────────────────────────────
    const bookingId = await bookingModel.create({
      event_type_id,
      invitee_name:  name,
      invitee_email: email,
      start_time,
      end_time,
      notes
    });

    res.status(201).json({
      message:    'Booking confirmed!',
      booking_id: bookingId,
      event:      eventType.title,
      name,
      email,
      start_time,
      end_time
    });
  } catch (error) {
    console.error('createBooking error:', error.message);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// GET /bookings/slots?date=YYYY-MM-DD
// Returns booked start times for a date so the booking page can grey them out
const getBookedSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'date query param is required (YYYY-MM-DD)' });
    }

    const slots = await bookingModel.getBookedStartTimes(date);
    res.status(200).json({ date, slots });
  } catch (error) {
    console.error('getBookedSlots error:', error.message);
    res.status(500).json({ error: 'Failed to fetch booked slots' });
  }
};

module.exports = { createBooking, getBookedSlots };
