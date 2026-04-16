// routes/healthRoutes.js
// -------------------------------------------------
// A simple route to verify the server is running.
// Useful for monitoring and debugging.
// -------------------------------------------------

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.get('/', healthController.checkHealth);

module.exports = router;
