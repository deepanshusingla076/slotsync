/**
 * Settings Model
 * Handles database queries for application-wide user settings.
 */

const db = require('../config/db');

const getSettings = async () => {
  const [rows] = await db.query('SELECT * FROM user_settings LIMIT 1');
  return rows[0] || { timezone: 'Asia/Kolkata' };
};

const updateSettings = async ({ timezone }) => {
  const [existing] = await db.query('SELECT id FROM user_settings LIMIT 1');
  if (existing.length > 0) {
    await db.query('UPDATE user_settings SET timezone = ? WHERE id = ?', [timezone, existing[0].id]);
  } else {
    await db.query('INSERT INTO user_settings (timezone) VALUES (?)', [timezone]);
  }
  return getSettings();
};

module.exports = { getSettings, updateSettings };
