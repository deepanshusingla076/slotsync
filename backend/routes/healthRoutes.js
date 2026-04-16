/**
 * Health Check Routes
 * Provides simple endpoints to verify that the server is operational.
 * Useful for monitoring, load balancers, and debugging.
 */
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.get('/', healthController.checkHealth);

module.exports = router;
