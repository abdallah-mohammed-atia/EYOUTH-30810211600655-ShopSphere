# Review Service

This is a minimal scaffold for the extracted Review Service used by Task 3.

Endpoints:
- `GET /reviews` — list reviews
- `POST /reviews` — create a review (JSON body: productId, text, rating)
- `GET /health` — health check

Run locally:

```bash
cd services/review-service
npm install
npm start
```

Deploy: any Node host or Vercel (Serverless).
