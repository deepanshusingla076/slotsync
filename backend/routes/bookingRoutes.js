// routes/bookingRoutes.js
const express = require('express');
const router  = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/slots', bookingController.getBookedSlots); // GET /bookings/slots?date=YYYY-MM-DD
router.post('/',     bookingController.createBooking);

module.exports = router;
