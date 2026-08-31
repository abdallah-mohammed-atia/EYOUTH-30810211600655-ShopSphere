const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const logger = require('pino')();

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'reviews.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'review-service' }));

app.get('/api/reviews', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json({ items: data });
});

app.post('/api/reviews', (req, res) => {
  const review = { id: Date.now(), ...req.body };
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.push(review);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  logger.info({ review }, 'created review');
  res.status(201).json({ review });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => logger.info({ port: PORT }, 'Review service running'));
