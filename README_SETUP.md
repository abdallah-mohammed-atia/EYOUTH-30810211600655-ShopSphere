Setup & deployment helper commands

These are one-line commands you can run locally to perform tasks required for submission. Anything that requires external credentials (Vercel/Supabase/Github secrets) must be done by you — commands below show exact values to paste.

1) Generate a secure `JWT_SECRET` (run in repo root):

```bash
node backend/scripts/generate_jwt_secret.js
```

2) Create Vercel projects (use web UI or `gh`/`vercel` CLIs). After creating, copy `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID_{BACKEND,FRONTEND}` into GitHub Secrets.

3) Example `DATABASE_URL` format (Supabase):

```
postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:5432/<DB_NAME>?schema=public
```

4) Run Prisma migrations and seed (after setting `DATABASE_URL`):

```bash
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
node scripts/seed.js
```

5) Create GitHub Secrets (paste values in Settings → Secrets → Actions):
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_BACKEND`
- `VERCEL_PROJECT_ID_FRONTEND`
- `CI_DATABASE_URL`
- `CI_DB_USER`
- `CI_DB_PASSWORD`
- `CI_DB_NAME`
- `CI_MONGODB_URI`
- `UPTIMEROBOT_API_KEY` (optional)

6) Deploy review service (folder `services/review-service`) to Vercel or another host and set `REVIEW_SERVICE_URL` in backend Vercel env.

If you want, I can produce exact `gh` or `vercel` CLI commands for any of the above (you'll need to run them locally).