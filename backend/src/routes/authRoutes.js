const express = require('express');
const { register, login, getCurrentUser, updateCurrentUser } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getCurrentUser);
router.put('/me', requireAuth, updateCurrentUser);

module.exports = router;
