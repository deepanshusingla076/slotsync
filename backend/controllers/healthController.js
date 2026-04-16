// controllers/healthController.js
// -------------------------------------------------
// Controller handles the logic for a route.
// Keeps routes clean — routes just direct traffic,
// controllers do the actual work.
// -------------------------------------------------

const db = require('../config/db');

const checkHealth = async (req, res) => {
  try {
    // Run a lightweight query to confirm DB is reachable
    await db.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      message: 'SlotSync API is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // DB is down, but server is still running
    res.status(500).json({
      status: 'error',
      message: 'SlotSync API is running but database is not connected',
      database: 'disconnected',
      error: error.message
    });
  }
};

module.exports = { checkHealth };
