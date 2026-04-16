// controllers/availabilityController.js
// -------------------------------------------------
// GET  /availability        → fetch all 7 days
// POST /availability        → save/update availability
// -------------------------------------------------

const availabilityModel = require('../models/availabilityModel');

const VALID_DAYS = [0, 1, 2, 3, 4, 5, 6]; // 0=Sun, 6=Sat

// GET /availability
const getAvailability = async (req, res) => {
  try {
    const availability = await availabilityModel.getAll();
    res.status(200).json(availability);
  } catch (error) {
    console.error('getAvailability error:', error.message);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

// POST /availability
// Accepts an array of day objects and upserts each one.
//
// Expected body:
// [
//   { "day_of_week": 1, "start_time": "09:00", "end_time": "17:00", "is_available": true },
//   { "day_of_week": 2, "start_time": "09:00", "end_time": "17:00", "is_available": false },
//   ...
// ]
const saveAvailability = async (req, res) => {
  try {
    const days = req.body;

    // Must be a non-empty array
    if (!Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ error: 'Request body must be an array of day objects' });
    }

    // Validate each day before touching the DB
    for (const day of days) {
      const { day_of_week, start_time, end_time, is_available } = day;

      if (!VALID_DAYS.includes(day_of_week)) {
        return res.status(400).json({ error: `day_of_week must be 0–6 (got ${day_of_week})` });
      }
      if (!start_time || !end_time) {
        return res.status(400).json({ error: `start_time and end_time are required for day ${day_of_week}` });
      }
      if (start_time >= end_time) {
        return res.status(400).json({ error: `end_time must be after start_time for day ${day_of_week}` });
      }
      if (typeof is_available !== 'boolean') {
        return res.status(400).json({ error: `is_available must be true or false for day ${day_of_week}` });
      }
    }

    // Upsert each day (insert new or update existing)
    for (const day of days) {
      await availabilityModel.upsertDay(day);
    }

    const updated = await availabilityModel.getAll();
    res.status(200).json({ message: 'Availability saved', availability: updated });
  } catch (error) {
    console.error('saveAvailability error:', error.message);
    res.status(500).json({ error: 'Failed to save availability' });
  }
};

module.exports = { getAvailability, saveAvailability };
