const db = require('../config/db');

const getAll = async () => {
  const { rows } = await db.query('SELECT * FROM availability ORDER BY day_of_week ASC');
  return rows;
};

const getByDay = async (dayOfWeek) => {
  const { rows } = await db.query('SELECT * FROM availability WHERE day_of_week = $1', [dayOfWeek]);
  return rows[0];
};

const upsertDay = async ({ day_of_week, start_time, end_time, is_available }) => {
  const { rowCount } = await db.query(
    'INSERT INTO availability (day_of_week, start_time, end_time, is_available) VALUES ($1, $2, $3, $4) ON CONFLICT (day_of_week) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, is_available = EXCLUDED.is_available',
    [day_of_week, start_time, end_time, is_available]
  );
  return { affectedRows: rowCount };
};

module.exports = { getAll, getByDay, upsertDay };
