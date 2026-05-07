// ============================================
// Rutas: Health Check
// ============================================
const express = require('express');
const router = express.Router();
const HealthController = require('../controllers/HealthController');

router.get('/',      HealthController.health);
router.get('/ready', HealthController.ready);

module.exports = router;
