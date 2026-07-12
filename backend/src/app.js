const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uploadsPath = path.join(__dirname, 'uploads');
const seedImagesPath = path.join(__dirname, 'seed-images');

app.use('/uploads', express.static(uploadsPath));
app.use('/seed-images', express.static(seedImagesPath));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'E-Commerce API',
    endpoints: ['/api', '/api/health', '/api/auth', '/api/products', '/api/cart'],
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/health', healthRoutes);

// Root API info to help clients hitting `/api` directly.
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'E-Commerce API',
    endpoints: ['/api/health', '/api/auth', '/api/products', '/api/cart'],
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
