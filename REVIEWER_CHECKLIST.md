# Reviewer Checklist — Fullstack E-Commerce Platform

This checklist contains concrete, copy-paste commands and verification steps reviewers can use to validate the project locally.

Prerequisites
- Node.js 20+, npm
- Docker & docker-compose (for running the full stack)

Bring the stack up

```bash
git clone <repo>
cd fullstack-ecommerce-abdallah-mohammed-atia
docker compose up --build -d
docker compose exec backend npm run seed
```

Backend tests

```bash
cd backend
NODE_ENV=test npm ci
npm test -- --runInBand
```

Frontend tests

```bash
cd ../frontend
npm ci
npm test -- --watchAll=false
```

Quick API smoke test

```bash
curl -s http://localhost:5000/api/products | jq '. | length'
```

What to verify (binary tests)
- Foundation: `docker compose up` completes without extra undocumented steps. Frontend reachable at `http://localhost:3000`.
- Auth: register/login flows work; admin-only endpoints return `403` for customers.
- Products: add/edit/delete/search/filter/pagination work end-to-end.
- Cart: add/update/remove items; totals are correct.
- Orders: create order, verify `orders` and `order_items` persisted and related.
- Tests: backend and frontend test suites pass locally.

Evidence for each PASS: provide the exact command you ran and the output or a screenshot.

Recommended reviewer files
- README.md — follow the setup steps exactly.
- backend/NON_DESTRUCTIVE_MIGRATION.md — migration guidance for production.

If something fails
- Capture the failing command and its complete stdout/stderr.
- Note whether the failure is environment-specific (e.g., Windows file locks) and suggest a repro on Linux if necessary.

<<<<<<< HEAD
Production verification (what the evaluator will check)
---------------------------------------------------
- Frontend and backend are reachable at public URLs (HTTPS) and load without build/runtime errors.
- The backend `/api/health` endpoint returns 200 from the public URL.
- The deployed backend uses Supabase Postgres for reads and writes (no local DB in production).
- Secrets are stored as environment variables in Vercel / GitHub Secrets; no secret values appear in the repository.
- Security protections active on the deployed backend: HTTPS, CORS restricted to the frontend domain, Helmet headers present, and rate limiting in effect.
- The review service runs at its own URL and the main app fetches reviews from it (if configured with `USE_EXTERNAL_REVIEW_SERVICE=true`).

Evidence required for submission:
- Public frontend URL
- Public backend URL (API)
- UptimeRobot monitor link or screenshot for the health endpoint
- `EYOUTH-30810211655-ShopSphere-links.md` with the three public URLs and shared with anyone who has the link


=======
>>>>>>> submission/main
-- End of checklist
