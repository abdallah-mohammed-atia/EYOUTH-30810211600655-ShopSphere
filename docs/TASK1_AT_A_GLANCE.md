# Task 1 — Production Deployment (At a Glance)

## 1. Task 1 at a Glance
This reading covers the first task of the ShopSphere project. The task is entirely about moving ShopSphere from the development environment into the production environment. Instead of the application running on the student’s own machine, it runs on the internet, and anyone who holds the link can open it.

In this task the student is responsible for the platform’s first genuine production deployment. The required deliverable is a fully functional production deployment of ShopSphere, reachable through public URLs.

Four things are required: deploy the application, connect it to a production database, secure it, and monitor it. They are divided across four sub-tasks.

Figure 1
Figure 1. The four sub-tasks that make up Task 1.
Sub-task	Title	Environment
1.1	Production Deployment	Vercel
1.2	Production Database	PostgreSQL on Supabase
1.3	Secrets and Production Security	Hosting platform environment variables, and the deployed backend
1.4	Health Check and Uptime Monitoring	The deployed backend, and UptimeRobot or an equivalent service

## 2. Sub-task 1.1: Production Deployment
The first step is the deployment itself. The ShopSphere frontend delivered in the first semester is deployed to Vercel as a production build, and the backend is deployed to Vercel as a production build as well.

Figure 2
Figure 2. Frontend and backend deployed to Vercel as production builds behind public URLs.
The words “production build” are deliberate. What is deployed is the production version of the application, not the development version.

Both of them must genuinely be live and reachable through public URLs, rather than running only on the student’s own machine. The deployed application must also open and run without any build errors and without any runtime errors. A link that opens onto an error page is not counted as a successful deployment.

A third item belongs to this part of the task: the submitted files follow the project naming convention, Student ID-ShopSphere. The naming convention is set out in full in the reading on project submission.

What is measured here

Not that the deployment was attempted, but that both public URLs open, and that the application loads and runs from them without an error.

## 3. Sub-task 1.2: Production Database
The second sub-task is the production database. The deployed application is connected to a production PostgreSQL database hosted on Supabase.

Figure 3
Figure 3. The deployed application reads from and writes to PostgreSQL on Supabase, with no local or development database in use.
The requirement is that the application genuinely reads from and writes to that database. Reading on its own is not enough: writing has to work as well.

One condition needs particular attention. The deployed application must not use any local database and must not use any development database. If the application is still reading from a database on the student’s own machine, this sub-task is not accepted even when everything else in it is working.

## 4. Sub-task 1.3: Secrets and Production Security
The third sub-task is securing the deployment, and it has two parts.

The first part is secrets. Every connection string and every key is stored as an environment variable on the hosting platform itself. The required result is stated plainly: no secret value is written inside the repository, anywhere in it. A single key left visible inside the code is enough for this item to score zero.

Figure 4
Figure 4. Secrets held as environment variables, and the four protections active on the deployed backend.
The second part is the standard HTTP protections on the deployed backend. Four things are enabled: HTTPS, CORS, Helmet, and rate limiting. The application must actually be served over HTTPS, and each of the other three protections must be active on the deployed backend rather than merely present in the code.

Written in the code is not the same as active

What is checked is the behavior of the deployed backend. A middleware that exists in the repository but is not in effect on the deployed service does not satisfy this item.

## 5. Sub-task 1.4: Health Check and Uptime Monitoring
The last part of the task is monitoring. A health-check endpoint is added to the backend, and that endpoint must return a success response from the public URL rather than from the student’s own machine.

Figure 5
Figure 5. The health-check endpoint responding from its public URL, watched by a monitoring service that reports its status.
The endpoint is then registered with UptimeRobot, or with any equivalent monitoring service. The monitoring service has to be registered on that particular endpoint, and it has to report the status of the service.

This one is not a formality

The monitoring configured here is the same monitoring the rollback plan depends on in Task 4. It is the tool by which a failed release is detected later in the project.

## 6. Acceptance Criteria for Task 1
The rubric assesses this task with four criteria, one for each sub-task, and each of them is worth either one point or zero.

Sub-task	What the criterion requires
Production deployment	The frontend and the backend are both live and reachable through public URLs; the deployed application loads with no build errors and no runtime errors; and the files follow the Student ID-ShopSphere naming convention.
Production database	The application reads from and writes to PostgreSQL on Supabase, and the deployed application uses no local or development database.
Secrets and security	No secret value appears anywhere in the repository; the application is served over HTTPS; and CORS, Helmet, and rate limiting are each active on the deployed backend.
Health check and monitoring	The endpoint returns a success response from the public URL, and the monitoring service is registered on it and reports the status of the service.

In the security criterion the operative words are “each active”. All three of the remaining protections are required, so two of them working and the third not means the criterion does not pass.

## 7. Summary
Task 1 takes the ShopSphere application out of the development environment and stands it up in production. The frontend and the backend are deployed to Vercel as production builds and served from public URLs with no build or runtime errors. The deployed application is connected to a production PostgreSQL database on Supabase and both reads from it and writes to it, with no local or development database left in use.

The deployment is then secured: connection strings and keys live as environment variables on the hosting platform, nothing secret remains in the repository, and HTTPS, CORS, Helmet, and rate limiting are active on the deployed backend. Finally a health-check endpoint answers from its public URL and is registered with a monitoring service that reports the status of the deployment.

This task is the ground the rest of the project stands on: Task 2 documents the deployment produced here, and Task 4 operates on the same production environment. The full submission details, from file names to sharing settings, are given in the reading on project submission.
