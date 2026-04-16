const db = require('../config/db');

const getSettings = async () => {
  const { rows } = await db.query('SELECT * FROM user_settings LIMIT 1');
  return rows[0] || { timezone: 'Asia/Kolkata' };
};

const updateSettings = async ({ timezone }) => {
  const { rows: existing } = await db.query('SELECT id FROM user_settings LIMIT 1');    
  if (existing.length > 0) {
    await db.query('UPDATE user_settings SET timezone = $1 WHERE id = $2', [timezone, existing[0].id]);
  } else {
    await db.query('INSERT INTO user_settings (timezone) VALUES ($1)', [timezone]);
  }
  return getSettings();
};

module.exports = { getSettings, updateSettings };
