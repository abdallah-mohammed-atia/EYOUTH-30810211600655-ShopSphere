PR: Prepare submission — serverless, security, k8s manifests, review-service, docs

Summary
- Convert backend to Vercel serverless-friendly entry (`backend/api/server.js`) and add `vercel.json`.
- Add Helmet, rate-limiting, and CORS configuration for production.
- Remove hard-coded secrets from examples and CI; reference GitHub Secrets for CI.
- Add structured logging (`pino`) and replace console logs in error handler.
- Add an independent `services/review-service` with simple REST endpoints and local storage for reviews.
- Add a serverless background function `backend/api/run-job.js` for scheduled tasks.
- Add Kubernetes manifests for `aws-simulation` and `gcp-simulation` namespaces and port-forward test helpers.
- Add deployment and monitoring documentation (`DEPLOYMENT.md`, `MONITORING.md`) and final submission artifacts (`EYOUTH-30810211655-ShopSphere-*` documents).

What you need to do after merging
- Create Supabase project and set `DATABASE_URL` in Vercel.
- Create Vercel projects for backend and frontend and add production environment variables.
- Add required GitHub Secrets for CI-driven deployments.
- Deploy the review service (services/review-service) and set `REVIEW_SERVICE_URL` in backend.
- Register UptimeRobot monitor for the backend health endpoint.

Branches & CI
- Branch name suggested: `prepare/submission`.
- CI will run tests and then the `deploy-to-vercel` job on merge to `main` if Secrets are configured.
