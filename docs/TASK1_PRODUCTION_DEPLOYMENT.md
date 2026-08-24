# Task 1 — Production Deployment

This document lists the exact steps, environment variable names, and verification commands to deploy ShopSphere to production (Vercel + Supabase).

1) Provision Supabase (Postgres)
- Create a Supabase project (region of your choice).
- In Supabase UI → Settings → Database, note the `Connection string` and `Project URL`.
- Create a service role key: Settings → API → Service key. Keep this secret.

Required secrets (GitHub / Vercel environment variables)
- `DATABASE_URL` — full Postgres connection string (postgresql://user:pass@host:port/dbname)
- `SUPABASE_URL` — Supabase project URL (https://xxxx.supabase.co)
- `SUPABASE_KEY` — Supabase service role key (secret)
- `JWT_SECRET` — backend JWT secret (strong random string)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — optional email config

2) Prepare the backend for production
- In `backend/.env` (local) or GitHub/Vercel secrets (production) set `DATABASE_URL` and `JWT_SECRET`.
- Run migrations (locally or CI) against Supabase:

```bash
npx prisma migrate deploy --schema=prisma/schema.prisma
node scripts/seed.js    # optional: seed initial data
```

3) Deploy backend and frontend to Vercel
- Option A: Vercel UI
  - Create a new Vercel Project, link to this GitHub repository.
  - Add Environment Variables (Production): `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`, `VERCEL_URL` (auto-set by Vercel)
  - Set Build & Output settings: Frontend `build` folder for static; Backend functions under `api/` or `services/*` per monorepo.

- Option B: Vercel CLI
  - Install: `npm i -g vercel`
  - Link and deploy:
```bash
cd frontend
vercel login
vercel link
vercel --prod
```

4) GitHub Actions and Secrets
- Add repository secrets (via GitHub UI or `gh`):
```powershell
gh secret set DATABASE_URL --body "<value>" --repo <owner>/<repo>
gh secret set SUPABASE_URL --body "<value>" --repo <owner>/<repo>
gh secret set SUPABASE_KEY --body "<value>" --repo <owner>/<repo>
gh secret set JWT_SECRET --body "<value>" --repo <owner>/<repo>
gh secret set VERCEL_TOKEN --body "<value>" --repo <owner>/<repo>
gh secret set VERCEL_PROJECT_ID --body "<value>" --repo <owner>/<repo>
gh secret set VERCEL_ORG_ID --body "<value>" --repo <owner>/<repo>
```

5) Health check and verification
- Backend health endpoint should exist at `/api/health` or `/health`.
- After deploy, verify:
```bash
curl https://<backend-url>/health
curl https://<frontend-url>/    # should return HTML 200
```
- Register the backend health URL in UptimeRobot (or equivalent).

6) Security checklist
- Ensure no secrets are committed: `git grep -n "SUPABASE_KEY\|DATABASE_URL\|JWT_SECRET"`
- Use HTTPS everywhere — Vercel provides TLS by default.
- Configure CORS to allow only frontend origin in production.

7) Rollback guidance
- If deployment fails, use Vercel UI to promote previous deployment or revert the `main` branch commit and re-deploy.
