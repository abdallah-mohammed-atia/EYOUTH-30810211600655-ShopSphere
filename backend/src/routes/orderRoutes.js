const express = require('express');
const { createOrder, getOrders, getOrder } = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);

module.exports = router;
