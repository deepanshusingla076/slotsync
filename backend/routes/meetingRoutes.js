// routes/meetingRoutes.js
const express = require('express');
const router  = express.Router();
const meetingController = require('../controllers/meetingController');

router.get('/upcoming', meetingController.getUpcoming);
router.get('/past',     meetingController.getPast);
router.delete('/:id',   meetingController.cancelMeeting);

module.exports = router;
