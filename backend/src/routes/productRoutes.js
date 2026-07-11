const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const upload = require('../middleware/upload');

const router = express.Router();

// Public
router.get('/', listProducts);
router.get('/:id', getProduct);

// Admin only
router.post('/', requireAuth, requireRole('admin'), upload.single('image'), createProduct);
router.put('/:id', requireAuth, requireRole('admin'), upload.single('image'), updateProduct);
router.delete('/:id', requireAuth, requireRole('admin'), deleteProduct);

module.exports = router;
