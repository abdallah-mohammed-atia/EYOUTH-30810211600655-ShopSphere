# GitHub & Vercel Secrets — Quick Commands

Use these commands to add required secrets to your GitHub repo and to deploy via Vercel CLI.

Replace `<owner>/<repo>` with `abdallah-mohammed-atia/fullstack-ecommerce-abdallah-mohammed-atia` or your repo path.

GitHub Secrets (example):

```powershell
gh secret set DATABASE_URL --body "postgresql://user:pass@host:5432/dbname" --repo abdallah-mohammed-atia/fullstack-ecommerce-abdallah-mohammed-atia
gh secret set SUPABASE_URL --body "https://xxxx.supabase.co" --repo abdallah-mohammed-atia/fullstack-ecommerce-abdallah-mohammed-atia
gh secret set SUPABASE_KEY --body "<service-role-key>" --repo abdallah-mohammed-atia/fullstack-ecommerce-abdallah-mohammed-atia
gh secret set JWT_SECRET --body "$(openssl rand -hex 32)" --repo abdallah-mohammed-atia/fullstack-ecommerce-abdallah-mohammed-atia
gh secret set VERCEL_TOKEN --body "<your-vercel-token>" --repo abdallah-mohammed-atia/fullstack-ecommerce-abdallah-mohammed-atia
gh secret set VERCEL_PROJECT_ID --body "<vercel-project-id>" --repo abdallah-mohammed-atia/fullstack-ecommerce-abdallah-mohammed-atia
gh secret set VERCEL_ORG_ID --body "<vercel-org-id>" --repo abdallah-mohammed-atia/fullstack-ecommerce-abdallah-mohammed-atia
```

Vercel CLI (deploy frontend and serverless functions):

```bash
npm i -g vercel
vercel login
cd frontend
vercel --prod

# For backend/serverless functions in mono-repo, ensure project settings map functions directory correctly
```

Notes:
- You can also set secrets via the GitHub web UI under Settings → Secrets → Actions.
- Never print secrets in CI logs; use them only via environment variables.
