Vercel + Supabase deployment notes
=================================

Quick steps to deploy the frontend on Vercel and connect backend/DB (Supabase):

1. Vercel project settings
   - Build Command: `npm run vercel-build`
   - Install Command: leave default (or `npm ci`)
   - Output Directory: `frontend/build`
   - Environment variables (add in Vercel Project > Settings > Environment Variables):
     - `REACT_APP_API_ORIGIN` = your backend API URL (e.g. `https://api.example.com`)
     - Any keys required by the frontend: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (if used by client)

2. Backend / Supabase
   - If you use Supabase for the database, ensure `DATABASE_URL` (Postgres) is available to your backend deployment.
   - Required server env vars (example): `DATABASE_URL`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, etc.

3. Repository setup (already applied)
   - A root `package.json` exists that forwards `install` and `build` to the `frontend` folder.
   - `vercel.json` is configured to build `frontend/package.json` and serve the `build` output.

4. Trigger a redeploy
   - Push a commit to `main` or trigger a redeploy in the Vercel dashboard.

5. Debugging
   - If Vercel build fails with missing dependencies, ensure Environment Variables and project Build Command match the above.
   - For local reproduction, run:
     ```powershell
     cd frontend
     npm install
     npm run build
     ```

If you want, I can set Vercel environment variables automatically using the `VERCEL_TOKEN` you already created — tell me which vars and their values (or confirm you want to paste them locally).
