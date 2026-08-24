# Task 4 — Production Operations

This file lists operational practices required for Task 4: monitoring, logging, CI secrets, branch protection, and rollback.

1) GitHub Actions / CI
- Required secrets (GitHub Actions secrets):
  - `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`, `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`
- Example workflow responsibilities:
  - `ci.yml`: install, test, build artifacts
  - `deploy.yml`: deploy to Vercel using `VERCEL_TOKEN`

2) Structured logging
- Use a JSON-structured logger in production (e.g., `pino` or `winston` configured for JSON).
- Include fields: `timestamp`, `level`, `service`, `requestId`, `path`, `method`, `statusCode`, `duration`, `error`.
- Example minimal Pino init (add to backend startup):
```js
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'info' });
module.exports = pino;
```

3) Monitoring & UptimeRobot
- Create an UptimeRobot HTTP(s) monitor for the backend health endpoint:
  - Monitor type: HTTP(s)
  - URL to check: `https://<backend-url>/health`
  - Interval: 5 minutes
  - Alert contacts: email / SMS as preferred

4) Incident runbook & rollback
- Detection: alerts from UptimeRobot or failing `main` CI.
- Immediate steps:
  1. Check Vercel deployments and recent GitHub Actions run.
  2. If deployment caused failure, promote previous deployment in Vercel or revert commit and re-deploy.
  3. If DB schema migration caused issues, restore Supabase snapshot (Supabase UI → Backups) to a non-production staging first.

5) Branch protection & release process
- Protect `main` branch: require status checks (CI) and require PR reviews.
- Use `staging` branch for pre-production testing; merges into `main` are releases.

6) Secrets rotation & least privilege
- Rotate `SUPABASE_KEY` periodically; prefer using service role keys only where needed.
- In GitHub Actions, avoid printing secrets to logs; mask sensitive outputs.

7) Logs access and retention
- Decide where logs live in production (e.g., external aggregator like Logflare, Papertrail, or Vercel logs + retention policy).
- Provide an example query to find errors by service:
  - `level:error AND service:backend` (depends on aggregator)
