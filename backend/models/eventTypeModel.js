const db = require('../config/db');

const CACHE_TTL_MS = 15000;
let eventTypesCache = null;
let cacheExpiresAt = 0;

const clearCache = () => {
  eventTypesCache = null;
  cacheExpiresAt = 0;
};

const getAll = async () => {
  if (eventTypesCache && Date.now() < cacheExpiresAt) {
    return eventTypesCache;
  }

  const { rows } = await db.query(
    `SELECT id, title, slug, description, duration_minutes, color, is_active, created_at, updated_at
     FROM event_types
     ORDER BY created_at DESC, id DESC`
  );

  eventTypesCache = rows;
  cacheExpiresAt = Date.now() + CACHE_TTL_MS;
  return rows;
};

const getById = async (id) => {
  const { rows } = await db.query('SELECT * FROM event_types WHERE id = $1', [id]);
  return rows[0];
};

const getBySlug = async (slug) => {
  const { rows } = await db.query('SELECT * FROM event_types WHERE slug = $1', [slug]);
  return rows[0];
};

const create = async ({ title, slug, description, duration_minutes, color }) => {
  const { rows } = await db.query(
    `INSERT INTO event_types (title, slug, description, duration_minutes, color)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [title, slug, description || null, duration_minutes, color || '#0066FF']
  );
  clearCache();
  return rows[0].id;
};

const update = async (id, { title, slug, description, duration_minutes, color, is_active }) => {
  const { rowCount } = await db.query(
    `UPDATE event_types
     SET title = $1, slug = $2, description = $3, duration_minutes = $4, color = $5, is_active = $6
     WHERE id = $7`,
    [title, slug, description || null, duration_minutes, color, is_active, id]
  );
  if (rowCount > 0) clearCache();
  return rowCount;
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM event_types WHERE id = $1', [id]);
  if (rowCount > 0) clearCache();
  return rowCount;
};

module.exports = { getAll, getById, getBySlug, create, update, remove, clearCache };
