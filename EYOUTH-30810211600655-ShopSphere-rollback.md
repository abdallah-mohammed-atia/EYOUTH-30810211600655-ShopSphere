Rollback plan (one page)

Detection:
- The UptimeRobot monitor on `https://<BACKEND_URL>/api/health` alerts when the endpoint returns non-2xx or does not respond.

Immediate actions:
1. Open the CI/CD pipeline and view the deployment that created the failing release.
2. If the deployment introduced a bad build, revert the `main` branch to the previous commit (create a new revert PR) or trigger a redeploy of the last known-good build.
3. If the deployment used Vercel, use Vercel dashboard to rollback/deploy the previous deployment snapshot.

Restoration steps (Vercel):
- From the Vercel project, open the Deployments list, find the previous successful deployment, and click "Promote" or re-deploy that commit to production.

Post-rollback verification:
- Confirm `/api/health` returns 200
- Run smoke tests: frontend loads, login/checkout flows functional
- Review logs for errors and root cause
