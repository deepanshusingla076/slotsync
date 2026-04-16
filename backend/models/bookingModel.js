/**
 * Booking Model
 * Handles database queries for bookings, including overlap detection, retrieval, and cancellations.
 */

const db = require('../config/db');

// Check if a new slot overlaps any existing CONFIRMED booking.
//
// Overlap condition (standard interval overlap formula):
//   existing.start_time < new_end  AND  existing.end_time > new_start
//
// This catches ALL overlap cases:
//   - exact duplicate times
//   - partial overlaps (e.g. 10:00–10:30 vs 10:15–10:45)
const hasOverlap = async (start_time, end_time) => {
  const [rows] = await db.query(
    `SELECT id FROM bookings
     WHERE status = 'confirmed'
       AND start_time < ?
       AND end_time   > ?`,
    [end_time, start_time]
  );
  return rows.length > 0; // true = conflict exists
};

// Insert a new confirmed booking
const create = async ({ event_type_id, invitee_name, invitee_email, start_time, end_time, notes }) => {
  const [result] = await db.query(
    `INSERT INTO bookings (event_type_id, invitee_name, invitee_email, start_time, end_time, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [event_type_id, invitee_name, invitee_email, start_time, end_time, notes || null]
  );
  return result.insertId;
};

// Upcoming: confirmed bookings in the future
const getUpcoming = async () => {
  const [rows] = await db.query(
    `SELECT b.*, e.title AS event_title, e.color, e.duration_minutes
     FROM bookings b
     JOIN event_types e ON b.event_type_id = e.id
     WHERE b.status = 'confirmed'
       AND b.start_time > NOW()
     ORDER BY b.start_time ASC`
  );
  return rows;
};

// Past: bookings that have already ended OR were cancelled
const getPast = async () => {
  const [rows] = await db.query(
    `SELECT b.*, e.title AS event_title, e.color, e.duration_minutes
     FROM bookings b
     JOIN event_types e ON b.event_type_id = e.id
     WHERE b.end_time < NOW()
        OR b.status = 'cancelled'
     ORDER BY b.start_time DESC`
  );
  return rows;
};

// Soft delete — marks booking as cancelled instead of removing the row
// This preserves history and keeps the audit trail intact
const cancelById = async (id) => {
  const [result] = await db.query(
    `UPDATE bookings SET status = 'cancelled' WHERE id = ? AND status = 'confirmed'`,
    [id]
  );
  return result.affectedRows; // 0 = not found or already cancelled
};

// Returns an array of booked start times (HH:MM) for a specific date
// Used by the booking page to know which slots are already taken
const getBookedStartTimes = async (date) => {
  const [rows] = await db.query(
    `SELECT TIME_FORMAT(start_time, '%H:%i') AS booked_time
     FROM bookings
     WHERE DATE(start_time) = ?
       AND status = 'confirmed'`,
    [date]
  );
  return rows.map(r => r.booked_time); // e.g. ['10:00', '14:30']
};

module.exports = { hasOverlap, create, getUpcoming, getPast, cancelById, getBookedStartTimes };
