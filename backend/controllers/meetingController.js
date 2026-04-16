// controllers/meetingController.js
// -------------------------------------------------
// GET  /meetings/upcoming  → future confirmed bookings
// GET  /meetings/past      → ended or cancelled bookings
// DELETE /meetings/:id     → soft cancel (status update)
// -------------------------------------------------

const bookingModel = require('../models/bookingModel');

// GET /meetings/upcoming
const getUpcoming = async (req, res) => {
  try {
    const meetings = await bookingModel.getUpcoming();
    res.status(200).json(meetings);
  } catch (error) {
    console.error('getUpcoming error:', error.message);
    res.status(500).json({ error: 'Failed to fetch upcoming meetings' });
  }
};

// GET /meetings/past
const getPast = async (req, res) => {
  try {
    const meetings = await bookingModel.getPast();
    res.status(200).json(meetings);
  } catch (error) {
    console.error('getPast error:', error.message);
    res.status(500).json({ error: 'Failed to fetch past meetings' });
  }
};

// DELETE /meetings/:id
// We don't actually delete from the DB — we soft-cancel.
// This preserves history and is better UX (shows "cancelled" in past)
const cancelMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await bookingModel.cancelById(id);

    if (affected === 0) {
      return res.status(404).json({ error: 'Meeting not found or already cancelled' });
    }

    res.status(200).json({ message: 'Meeting cancelled successfully' });
  } catch (error) {
    console.error('cancelMeeting error:', error.message);
    res.status(500).json({ error: 'Failed to cancel meeting' });
  }
};

module.exports = { getUpcoming, getPast, cancelMeeting };
