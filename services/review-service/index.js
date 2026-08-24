const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory store (example). Replace with real DB connection in production.
let reviews = [
  { id: 1, productId: 1, text: 'Great product', rating: 5 }
];

app.get('/reviews', (req, res) => {
  res.json(reviews);
});

app.post('/reviews', (req, res) => {
  const { productId, text, rating } = req.body;
  const id = reviews.length ? reviews[reviews.length -1].id + 1 : 1;
  const review = { id, productId, text, rating };
  reviews.push(review);
  res.status(201).json(review);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Review service listening on ${port}`));
