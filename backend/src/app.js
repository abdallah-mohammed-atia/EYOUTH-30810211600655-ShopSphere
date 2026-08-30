const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const healthRoutes = require('./routes/healthRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./lib/logger');

const app = express();

// Security middlewares
app.use(helmet());

// Trust proxy configuration:
// - If `TRUST_PROXY` explicitly set to 'true', enable permissive trust (use with caution).
// - If running on Vercel, trust the first proxy only (value = 1) to avoid permissive behavior.
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', true);
} else if (process.env.VERCEL === '1') {
  app.set('trust proxy', 1);
}

// Rate limiting: sensible defaults, can be overridden via env
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
});
app.use(limiter);

// CORS: restrict in production via environment variable
const corsOrigin = process.env.API_ORIGIN || process.env.FRONTEND_ORIGIN || '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.originalUrl, ip: req.ip }, 'incoming request');
  next();
});

const uploadsPath = path.join(__dirname, 'uploads');
const seedImagesPath = path.join(__dirname, 'seed-images');

app.use('/uploads', express.static(uploadsPath));
app.use('/seed-images', express.static(seedImagesPath));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'E-Commerce API',
    endpoints: ['/api', '/api/health', '/api/auth', '/api/products', '/api/cart', '/api/orders'],
  });
});

app.use('/api', healthRoutes);
app.use('/health', healthRoutes);

// Root API info to help clients hitting `/api` directly.
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'E-Commerce API',
    endpoints: ['/api/health', '/api/auth', '/api/products', '/api/cart', '/api/orders', '/api/categories', '/api/reviews', '/api/admin'],
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);

// Reviews: either proxy to external review service or mount internal routes
// Reviews: proxied entirely to the independently deployed review-service.
const fetch = require('node-fetch');
app.use('/api/reviews', async (req, res, next) => {
  try {
    const path = req.originalUrl.replace('/api/reviews', '');
    const url = new URL(process.env.REVIEW_SERVICE_URL + '/api/reviews' + path);
    const forwardHeaders = { 'content-type': 'application/json' };
    if (req.headers.authorization) {
      forwardHeaders.authorization = req.headers.authorization;
    }
    const fetchRes = await fetch(url.toString(), {
      method: req.method,
      headers: forwardHeaders,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    });
    const text = await fetchRes.text();
    res.status(fetchRes.status).send(text);
  } catch (err) {
    next(err);
  }
});

app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
