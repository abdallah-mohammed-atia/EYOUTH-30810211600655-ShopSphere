# Deployment to Vercel and Supabase (Task 1 — instructions)

This file documents the steps and secrets required to deploy the ShopSphere application to Vercel and connect it to a Supabase (Postgres) production database.

Required secrets (set these in Vercel project and GitHub Secrets):

- `DATABASE_URL` — full Postgres connection string for Supabase (e.g. `postgresql://user:pass@host:5432/dbname?schema=public`)
- `MONGODB_URI` — MongoDB connection string (use a managed Atlas cluster in production)
- `JWT_SECRET` — long random secret for signing JWTs
- `API_ORIGIN` or `FRONTEND_ORIGIN` — frontend origin (https://your-frontend-url)
- `UPTIMEROBOT_API_KEY` — (optional) API key to register monitors
- `VERCEL_TOKEN` — (optional) for automated deploys from CI

Backend deployment (recommended: create a Vercel project with Root set to the `backend` folder):

1. Create a Vercel project and set the "Root Directory" to the `backend` folder.
2. Add the required environment variables listed above to the Vercel project (Production environment).
3. In the Vercel project, the `backend/api/server.js` file will be deployed as a serverless function and will serve `/api/*` routes.

Frontend deployment (create a second Vercel project for the `frontend` folder):

1. Create a Vercel project with Root set to the `frontend` folder.
2. Add an environment variable `REACT_APP_API_ORIGIN` set to your backend public URL (e.g., `https://<your-backend>.vercel.app`).

Supabase (Postgres):

1. Create a Supabase project and a Postgres database.
2. Obtain the connection string or the `SUPABASE_SERVICE_ROLE_KEY` and set `DATABASE_URL` in Vercel.
3. Run migrations by connecting to Supabase from your local machine or CI and executing `npx prisma migrate deploy` with `DATABASE_URL` set to your Supabase DB.

Notes on serverless & Prisma:

- We use a global Prisma client instance (see `backend/src/lib/prisma.js`) to reuse connections across serverless invocations.
- For high-concurrency serverless production, consider using Prisma Data Proxy or Supabase client libraries to avoid connection limits.

Verification checklist (Task 1 acceptance):

- [ ] Frontend and backend public URLs work and load without build/runtime errors.
- [ ] The deployed backend reads from and writes to the Supabase Postgres DB (run a CRUD request to confirm writes).
- [ ] No secret values are present in the repository (`.env.example` contains placeholders only).
- [ ] HTTPS in effect; CORS, Helmet, and rate-limiting are active on the deployed backend.
- [ ] Health endpoint `/api/health` returns `200` publicly and is registered with a monitoring service.
