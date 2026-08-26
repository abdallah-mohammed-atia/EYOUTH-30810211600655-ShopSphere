Non-destructive Prisma migration guide
=====================================

Purpose
-------
Steps to create, review, and safely apply Prisma schema changes to an existing Postgres database without running `prisma migrate reset` (no destructive reset).

Prerequisites
-------------
- A recent backup of your production/staging Postgres database.
- Access to the server or CI where migrations will be applied.
- `prisma` installed (via `npx prisma` or global install).
- Correct `DATABASE_URL` in environment (do NOT point to production from local dev).

High-level steps
----------------
1. Backup the target database.
2. Create migration files locally without applying them.
3. Review and, if needed, hand-edit the generated SQL.
4. Push the migration files to version control and CI.
5. Apply the migration in a controlled environment (staging, then production) using `prisma migrate deploy` or by applying the SQL manually.

Detailed commands
-----------------

1) Backup (always do this first)

```bash
# Replace values as needed
pg_dump -h localhost -p 5432 -U postgres -Fc -f backup-ecommerce.dump ecommerce
# To restore (example):
pg_restore -h localhost -p 5432 -U postgres -d ecommerce backup-ecommerce.dump
```

2) Create migration files only (no apply)

```bash
cd backend
# Create migration files in prisma/migrations but do NOT apply them
npx prisma migrate dev --create-only --name add_orders
```

This generates a new migration folder under `backend/prisma/migrations/*/migration.sql` you must review.

3) Review and adjust migration SQL

Open the generated SQL and confirm each statement is safe for your schema and data. If needed, edit the SQL for performance (create indexes concurrently, use `LOCK` commands carefully, or split large changes into multiple migrations).

Path to review:
- backend/prisma/migrations/<timestamp>_add_orders/migration.sql

4) Push migration files to your repo and run in staging

- Commit the new migration folder and push to your repo and CI.
- In staging (or a maintenance window), run:

```bash
# On the staging/production host (ensure DATABASE_URL points to target db)
cd backend
npx prisma migrate deploy
# Then regenerate Prisma client (if needed by your deployment step)
npx prisma generate
```

`prisma migrate deploy` will run unapplied migrations from `prisma/migrations` in order.

5) Alternative: apply SQL manually

If you prefer more control, run the SQL through `psql` or a DB admin tool after reviewing the statements:

```bash
psql "$DATABASE_URL" -f backend/prisma/migrations/<timestamp>_add_orders/migration.sql
```

6) Post-deploy checks

- Verify app health endpoints and run smoke tests.
- Verify important indexes exist and table row counts look correct.
- Monitor errors and slow queries for a short period.

Windows / Prisma client notes
-----------------------------
- On Windows, `npx prisma generate` can fail with EPERM if Node processes keep query engine files locked. Stop local Node processes (dev servers, watchers) before running `prisma generate`.
- CI runners (Linux) avoid Windows file-lock issues.

Rollback plan
-------------
- If migration fails or causes issues, restore from the backup taken in step 1:

```bash
pg_restore -h <host> -p <port> -U <user> -d <database> backup-ecommerce.dump
```

- For single-statement mistakes you may also create a corrective migration that reverts or fixes the problematic change rather than rolling back the whole DB.

Quick checklist before production
---------------------------------
- [ ] Backup created and verified.
- [ ] Migration SQL reviewed by a developer or DBA.
- [ ] Migration files committed and code reviewed.
- [ ] Staging deployment applied and smoke-tested.
- [ ] Deployment window scheduled and stakeholders informed (if required).

Notes
-----
- Avoid `prisma migrate reset` on production — it drops data.
- Use `--create-only` to review auto-generated SQL before applying.
- If your schema adds relations, ensure opposite relation fields exist in Prisma models (P1012 validation error) before creating migrations.

If you'd like, I can:
- Create a PR with the new migration files and a short deploy checklist.
- Generate a one-page runbook for applying the migration in your CI/CD system.
