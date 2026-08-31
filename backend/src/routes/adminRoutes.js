const express = require('express');
const { getAdminStats } = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { listActivity } = require('../controllers/activityController');

const router = express.Router();

router.get('/stats', requireAuth, requireRole('admin'), getAdminStats);
router.get('/activity', requireAuth, requireRole('admin'), listActivity);

module.exports = router;
