// server.js
// -------------------------------------------------
// Entry point of the backend. This file:
//   1. Loads environment variables
//   2. Creates the Express app
//   3. Registers middleware (CORS, JSON parsing)
//   4. Mounts all routes
//   5. Starts listening on a port
// -------------------------------------------------

require('dotenv').config(); // Must be first — loads .env variables

const express = require('express');
const cors = require('cors');

const healthRoutes       = require('./routes/healthRoutes');
const eventTypeRoutes    = require('./routes/eventTypeRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const bookingRoutes      = require('./routes/bookingRoutes');
const meetingRoutes      = require('./routes/meetingRoutes');
const settingsRoutes     = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────
// cors()         → allows the Next.js frontend to call this API
// express.json() → parses incoming JSON request bodies
app.use(cors());
app.use(express.json());

const contactRoutes      = require('./routes/contactRoutes');

app.use('/health',       healthRoutes);
app.use('/event-types',  eventTypeRoutes);
app.use('/availability', availabilityRoutes);
app.use('/bookings',     bookingRoutes);
app.use('/meetings',     meetingRoutes);
app.use('/settings',     settingsRoutes);
app.use('/contact',      contactRoutes);

// 404 handler — catches any unrecognized routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Global error handler — catches unexpected errors thrown in controllers
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start Server ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ SlotSync API running at http://localhost:${PORT}`);
  console.log(`🔍 Health check → http://localhost:${PORT}/health`);
});
