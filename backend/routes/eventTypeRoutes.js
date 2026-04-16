/**
 * Event Type Routes
 * Defines endpoints for creating, retrieving, updating, and deleting event types.
 */
const express = require('express');
const router  = express.Router();
const eventTypeController = require('../controllers/eventTypeController');

router.get('/',            eventTypeController.getAllEventTypes);
router.get('/slug/:slug',  eventTypeController.getEventTypeBySlug); // must be before /:id
router.post('/',           eventTypeController.createEventType);
router.put('/:id',         eventTypeController.updateEventType);
router.delete('/:id',      eventTypeController.deleteEventType);

module.exports = router;
