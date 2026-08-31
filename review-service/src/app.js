const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'shopsphere-review-service', routes: ['/health', '/api/reviews'] });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'shopsphere-review-service' });
});

app.use('/api/reviews', reviewRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
