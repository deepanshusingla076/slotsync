/**
 * Availability Model
 * Handles database queries related to user availability constraints.
 */

const db = require('../config/db');

// Return all 7 days sorted by day number
const getAll = async () => {
  const [rows] = await db.query(
    'SELECT * FROM availability ORDER BY day_of_week ASC'
  );
  return rows;
};

// Get availability for a single day (used during booking validation)
const getByDay = async (dayOfWeek) => {
  const [rows] = await db.query(
    'SELECT * FROM availability WHERE day_of_week = ?', [dayOfWeek]
  );
  return rows[0];
};

// INSERT a new day row OR UPDATE if it already exists (upsert)
// ON DUPLICATE KEY UPDATE fires when the UNIQUE(day_of_week) constraint is hit
const upsertDay = async ({ day_of_week, start_time, end_time, is_available }) => {
  const [result] = await db.query(
    `INSERT INTO availability (day_of_week, start_time, end_time, is_available)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       start_time   = VALUES(start_time),
       end_time     = VALUES(end_time),
       is_available = VALUES(is_available)`,
    [day_of_week, start_time, end_time, is_available]
  );
  return result;
};

module.exports = { getAll, getByDay, upsertDay };
