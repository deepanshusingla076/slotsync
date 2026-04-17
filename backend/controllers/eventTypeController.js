// controllers/eventTypeController.js
// -------------------------------------------------
// Handles request validation and response for all
// Event Type endpoints. Calls model for DB work.
// -------------------------------------------------

const eventTypeModel = require('../models/eventTypeModel');

// Helper: convert a title to a URL-safe slug
// "My 30-Min Call!" → "my-30-min-call"
const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-');         // spaces → hyphens

// GET /event-types
const getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await eventTypeModel.getAll();
    res.set('Cache-Control', 'private, max-age=15');
    res.status(200).json(eventTypes);
  } catch (error) {
    console.error('getAllEventTypes error:', error.message);
    res.status(500).json({ error: 'Failed to fetch event types' });
  }
};

// POST /event-types
const createEventType = async (req, res) => {
  try {
    const { title, description, duration_minutes, color } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title is required' });
    }
    if (!duration_minutes || isNaN(duration_minutes) || duration_minutes <= 0) {
      return res.status(400).json({ error: 'duration_minutes must be a positive number' });
    }

    // Slug generation + uniqueness check
    const slug = generateSlug(title);
    const existing = await eventTypeModel.getBySlug(slug);
    if (existing) {
      return res.status(409).json({ error: `Slug "${slug}" is already taken. Use a different title.` });
    }

    const id = await eventTypeModel.create({ title: title.trim(), slug, description, duration_minutes, color });
    const created = await eventTypeModel.getById(id);

    res.status(201).json(created);
  } catch (error) {
    console.error('createEventType error:', error.message);
    res.status(500).json({ error: 'Failed to create event type' });
  }
};

// PUT /event-types/:id
const updateEventType = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration_minutes, color, is_active } = req.body;

    // Check the event type exists
    const existing = await eventTypeModel.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'title is required' });
    }
    if (!duration_minutes || isNaN(duration_minutes) || duration_minutes <= 0) {
      return res.status(400).json({ error: 'duration_minutes must be a positive number' });
    }

    // Regenerate slug from new title; check uniqueness if it changed
    const slug = generateSlug(title);
    if (slug !== existing.slug) {
      const slugTaken = await eventTypeModel.getBySlug(slug);
      if (slugTaken) {
        return res.status(409).json({ error: `Slug "${slug}" is already taken.` });
      }
    }

    const affected = await eventTypeModel.update(id, {
      title: title.trim(),
      slug,
      description,
      duration_minutes,
      color: color || existing.color,
      is_active: is_active !== undefined ? is_active : existing.is_active
    });

    if (affected === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    const updated = await eventTypeModel.getById(id);
    res.status(200).json(updated);
  } catch (error) {
    console.error('updateEventType error:', error.message);
    res.status(500).json({ error: 'Failed to update event type' });
  }
};

// DELETE /event-types/:id
const deleteEventType = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await eventTypeModel.remove(id);

    if (affected === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    res.status(200).json({ message: 'Event type deleted successfully' });
  } catch (error) {
    console.error('deleteEventType error:', error.message);
    res.status(500).json({ error: 'Failed to delete event type' });
  }
};

// GET /event-types/slug/:slug  — used by the public booking page
const getEventTypeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const eventType = await eventTypeModel.getBySlug(slug);
    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    res.status(200).json(eventType);
  } catch (error) {
    console.error('getEventTypeBySlug error:', error.message);
    res.status(500).json({ error: 'Failed to fetch event type' });
  }
};

module.exports = { getAllEventTypes, createEventType, updateEventType, deleteEventType, getEventTypeBySlug };
