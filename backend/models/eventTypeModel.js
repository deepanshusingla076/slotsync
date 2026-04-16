// models/eventTypeModel.js
// -------------------------------------------------
// All SQL queries for the event_types table live here.
// Controllers call these functions — no SQL in controllers.
// -------------------------------------------------

const db = require('../config/db');

// Fetch all event types, newest first
const getAll = async () => {
  const [rows] = await db.query(
    'SELECT * FROM event_types ORDER BY created_at DESC'
  );
  return rows;
};

// Fetch a single event type by its primary key
const getById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM event_types WHERE id = ?', [id]
  );
  return rows[0]; // undefined if not found
};

// Check if a slug is already taken (used to validate uniqueness)
const getBySlug = async (slug) => {
  const [rows] = await db.query(
    'SELECT * FROM event_types WHERE slug = ?', [slug]
  );
  return rows[0];
};

// Insert a new event type
const create = async ({ title, slug, description, duration_minutes, color }) => {
  const [result] = await db.query(
    `INSERT INTO event_types (title, slug, description, duration_minutes, color)
     VALUES (?, ?, ?, ?, ?)`,
    [title, slug, description || null, duration_minutes, color || '#0066FF']
  );
  return result.insertId;
};

// Update an existing event type by id
const update = async (id, { title, slug, description, duration_minutes, color, is_active }) => {
  const [result] = await db.query(
    `UPDATE event_types
     SET title = ?, slug = ?, description = ?, duration_minutes = ?, color = ?, is_active = ?
     WHERE id = ?`,
    [title, slug, description || null, duration_minutes, color, is_active, id]
  );
  return result.affectedRows; // 0 = not found, 1 = updated
};

// Hard delete an event type (also cascades to its bookings via FK)
const remove = async (id) => {
  const [result] = await db.query(
    'DELETE FROM event_types WHERE id = ?', [id]
  );
  return result.affectedRows;
};

module.exports = { getAll, getById, getBySlug, create, update, remove };
