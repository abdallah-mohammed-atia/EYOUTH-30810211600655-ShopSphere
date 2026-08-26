Architecture Decision Record — Review extraction & serverless background

Decision: Extract `reviews` into an independently deployed review service, and implement a background health-check job as a Vercel serverless function.

Rationale:
- Reviews are a clearly separable domain with independent lifecycle and storage needs; moving them out reduces coupling and enables independent scaling.
- Background monitoring/maintenance tasks (health pings, summary jobs) are event-driven and short-lived; serverless functions provide cost-efficient execution and easy deployment.

Consequences:
- The main application queries the review service via REST (`REVIEW_SERVICE_URL`) in production; internal review handlers are disabled when `USE_EXTERNAL_REVIEW_SERVICE=true`.
- The review service is deployed separately and reachable at its own URL; the serverless function runs outside the main app and can be invoked on schedule.
