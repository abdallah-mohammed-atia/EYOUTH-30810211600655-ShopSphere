# ShopSphere — Task Checklist and Deliverables

This checklist breaks the Level 5 project into actionable deliverables and suggested filenames/locations to include in your repository. Complete each item and ensure visibility (working links, endpoints, or files) as required by the visibility rule.

See the full Level 5 reading: `docs/LEVEL5_READING-ShopSphere.md` for project context, rules, tools, and learning outcomes.

-- Task 1: Production Deployment
- Deliverable: Fully functional production deployment of ShopSphere.
- Suggested artifacts:
  - `docs/TASK1_PRODUCTION_DEPLOYMENT.md` — deployment notes (Vercel, Supabase, DNS, secrets)
  - `infra/k8s/` — Kubernetes manifests (if using K8s)
  - `.github/workflows/deploy.yml` — automated deployment pipeline
  - Public endpoints (Frontend URL, Backend API URL, Health check)
- Checklist:
  - [ ] Deploy frontend to Vercel (provide URL)
  - [ ] Deploy backend / functions (provide URL and health endpoint)
  - [ ] Connect production PostgreSQL (Supabase) and confirm migrations
  - [ ] Store secrets safely (GitHub Secrets / Vercel environment vars)

  Subtasks for Task 1:
  - [ ] 1.1 Production Deployment: Frontend and backend deployed as production builds to Vercel and reachable over public URLs.
  - [ ] 1.2 Production Database: App reads from and writes to PostgreSQL on Supabase; no local/dev DB in use.
  - [ ] 1.3 Secrets & Security: No secrets in repository; secrets stored in hosting env vars; HTTPS, CORS, Helmet, and rate limiting active on deployed backend.
  - [ ] 1.4 Health Check & Monitoring: Health endpoint responds from public URL and is registered with UptimeRobot (or equivalent) and reporting.

-- Task 2: Cloud Preparation
- Deliverable: Cloud-ready architecture diagram + simplified multi-cloud simulation.
- Suggested artifacts:
  - `docs/ARCHITECTURE.md` — architecture diagram and component descriptions
  - `infra/multi-cloud-sim/` — simple namespace-based K8s simulation manifests
  - `docs/TASK2_MULTI_CLOUD.md` — steps to run the simulation
- Checklist:
  - [ ] Create an architecture diagram showing services and managed services
  - [ ] Demonstrate namespace isolation (Kubernetes) to simulate multi-cloud
  - [ ] Document how the system scales and where managed services are used

  Subtasks for Task 2:
  - [ ] 2.1 Architecture Diagram: Diagram shows frontend, backend, database, and traffic path; matches Task 1 deployment; file follows Student ID-ShopSphere naming.
  - [ ] 2.2 Cloud Service Classification: Classify frontend hosting, backend hosting, and Supabase DB as IaaS/PaaS/SaaS with a one-line reason each.
  - [ ] 2.3 Multi-Cloud Namespace Simulation: Create `aws-simulation` and `gcp-simulation` namespaces; run frontend & backend pods and services in each; services respond via `kubectl port-forward`; resources in one namespace are not visible from the other.

-- Task 3: Application Modernization
- Deliverable: Modernized application components and service boundaries.
- Suggested artifacts:
  - `docs/TASK3_MODERNIZATION.md` — description of changes and migration plan
  - `services/` or `packages/` — optional split into independently deployed services
  - `functions/` — serverless functions implemented on Vercel
- Checklist:
  - [ ] Identify and extract at least one independent service or serverless function
  - [ ] Provide deployment manifests or instructions for the modernized service
  - [ ] Run a background workload as a serverless function and show logs

  Subtasks for Task 3:
  - [ ] 3.1 Review Service Extraction: Extract `reviews` into an independently deployed service with its own repository and public URL; remove review logic from the main app.
  - [ ] 3.2 REST Communication: Ensure reviews in ShopSphere arrive via REST from the review service and the main app still works end to end.
  - [ ] 3.3 Serverless Integration: Deploy one serverless function on Vercel that runs outside the main application and executes successfully.
  - [ ] 3.4 Architecture Decision Record: Add a one-page ADR naming the extracted service and the serverless workload and explaining the reasons.

-- Task 4: Production Operations
- Deliverable: Operational practices, monitoring, logging, and rollback plan.
- Suggested artifacts:
  - `docs/TASK4_OPERATIONS.md` — monitoring, incident runbook, rollback plan
  - `.github/workflows/ci.yml` — CI pipeline with structured logging and tests
  - `docs/SECURITY.md` — secrets handling and HTTP protections
- Checklist:
  - [ ] Implement uptime and alerting (UptimeRobot or equivalent) and publish check URL
  - [ ] Add structured logs and show examples in `logs/` or in deployment logs
  - [ ] Document rollback procedure and post-deploy validation steps

  Subtasks for Task 4:
  - [ ] 4.1 CI/CD Pipeline and Secrets: Configure `development`, `staging`, and `production` environments with separate env vars; provide a GitHub Actions pipeline that installs, builds, and deploys to production on merge to `main`; ensure pipeline credentials are stored in GitHub Actions secrets and not exposed in workflows or logs; protect `main` branch so merges only succeed after the pipeline.
  - [ ] 4.2 Structured Logging: Emit request and error logs with timestamp and severity; state where logs are read in production (e.g., log aggregator or cloud logs console).
  - [ ] 4.3 Rollback Plan: Provide a one-page rollback plan describing detection via Task 1 monitoring and the exact steps to restore the previous working version.
  - [ ] 4.4 Project Sharing: Create one public document named `Student ID-ShopSphere` listing the application URL, review service URL, and repository URL; ensure it's viewable by anyone with the link.

-- Rules and submission checks
- Naming rule: ensure submitted files/repositories use the `Student ID-ShopSphere` pattern.
- Visibility rule: include working links, endpoints, files, or logs demonstrating each claim.
