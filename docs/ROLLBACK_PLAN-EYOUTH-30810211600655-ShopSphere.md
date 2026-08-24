# Rollback Plan — EYOUTH-30810211600655-ShopSphere

This document provides a minimal rollback plan for production deployments.

1. Identify the failing release by checking Vercel deployments or GitHub Actions run.
2. Revert the commit in GitHub: create a PR that reverts the faulty merge and merge to `main`.
3. If immediate rollback required, use Vercel UI to promote the previous successful deployment.
4. Restore database snapshot if migrations caused data loss (ensure you have snapshots).
5. Postmortem: open an issue with tags `incident` and `rollback` and attach logs.

Notes:
- Keep at least 3 recent production deployment versions in Vercel.
- For DB rollbacks, prefer restoring to read-only staging before pointing production.
