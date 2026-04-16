const db = require('../config/db');

const hasOverlap = async (start_time, end_time) => {
  const { rows } = await db.query(
    `SELECT id FROM bookings
     WHERE status = 'confirmed'
       AND start_time < $1
       AND end_time   > $2`,
    [end_time, start_time]
  );
  return rows.length > 0;
};

const create = async ({ event_type_id, invitee_name, invitee_email, start_time, end_time, notes }) => {
  const { rows } = await db.query(
    `INSERT INTO bookings (event_type_id, invitee_name, invitee_email, start_time, end_time, notes)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [event_type_id, invitee_name, invitee_email, start_time, end_time, notes || null]
  );
  return rows[0].id;
};

const getUpcoming = async () => {
  const { rows } = await db.query(
    `SELECT b.*, e.title AS event_title, e.color, e.duration_minutes
     FROM bookings b
     JOIN event_types e ON b.event_type_id = e.id
     WHERE b.status = 'confirmed'
       AND b.end_time > NOW()
     ORDER BY b.start_time ASC`
  );
  return rows;
};

const getPast = async () => {
  const { rows } = await db.query(
    `SELECT b.*, e.title AS event_title, e.color, e.duration_minutes
     FROM bookings b
     JOIN event_types e ON b.event_type_id = e.id
     WHERE b.end_time <= NOW()
        OR b.status = 'cancelled'
     ORDER BY b.start_time DESC`
  );
  return rows;
};

const cancelById = async (id) => {
  const { rowCount } = await db.query(
    `UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND status = 'confirmed'`,
    [id]
  );
  return rowCount;
};

const getBookedStartTimes = async (date) => {
  const { rows } = await db.query(
    `SELECT to_char(start_time, 'HH24:MI') AS booked_time
     FROM bookings
     WHERE DATE(start_time) = $1
       AND status = 'confirmed'`,
    [date]
  );
  return rows.map(r => r.booked_time);
};

module.exports = { hasOverlap, create, getUpcoming, getPast, cancelById, getBookedStartTimes };
