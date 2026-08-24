# Level 5 - ShopSphere Enterprise Production and Cloud Modernization

## Project Overview

This reading introduces the Level 5 final project, **ShopSphere Enterprise Production and Cloud Modernization**. It explains what the project is, what it continues from, how the work is divided into four tasks, which technologies are used, and the two rules that govern every part of it. Each task has a full reading of its own, and this document is the general introduction to all of them.

### 1. Project Context and Purpose
This reading introduces the Level 5 final project, **ShopSphere Enterprise Production and Cloud Modernization**. It explains what the project is, what it continues from, how the work is divided into four tasks, which technologies are used, and the two rules that govern every part of it. Each task has a full reading of its own, and this document is the general introduction to all of them.

The stage the student has now reached is not a stage of new lessons. It is the final project of the level, and its official name is the ShopSphere Enterprise Production and Cloud Modernization project.

Because this is the final project of the level, it gathers the skills of the whole level and applies them to one real application. The readings that follow take each task in turn, and after them come the reading on the rubric and the reading on submission.

### 2. Where the Project Starts
This project does not start from nothing. It continues from **ShopSphere**, the e-commerce platform the student built in the first semester. The application already exists and already works, and what is asked now is something different in kind: preparing it for production.

The scenario is that the team has finished developing ShopSphere and intends to release it to real users. For that to happen, the platform has to be ready for a production environment that is secure, scalable, and available at all times.

That is what the project consists of: deploying the application, securing it, monitoring it, changing the shape of its architecture, and building a proper CI/CD pipeline around it.

### 3. One Continuous Project
The project contains four tasks, but they are not four separate exercises. They are one continuous journey from beginning to end. The student starts from the ShopSphere application delivered in the first semester and finishes with that same application running as a production-ready system.

The most important consequence follows from this: **each task is evaluated on the deliverable produced by the task before it**. If Task 1 was not finished correctly, the task after it has no ground to stand on.

Work them in order — The tasks are not worked in reverse and not worked in parallel. They run from one to four, in that order.

### 4. The Four Tasks and Their Deliverables
These are the four tasks and the deliverable each one produces.

- Task 1: Production Deployment — A fully functional production deployment of ShopSphere.
- Task 2: Cloud Preparation — A cloud-ready architecture for ShopSphere, together with a simplified multi-cloud simulation.
- Task 3: Application Modernization — A modernized version of the ShopSphere application.
- Task 4: Production Operations — A ShopSphere application that is genuinely ready for production.

### 5. The Technologies of the Project
The tools used in the project are fixed, and each of them covers one area of the work.

- Frontend and backend hosting: Vercel
- Production database: PostgreSQL on Supabase
- Container orchestration: Kubernetes, with `kubectl`
- Serverless: Vercel Serverless Functions
- Continuous integration and delivery: GitHub Actions
- Uptime monitoring: UptimeRobot (or equivalent)
- Source control: Git and GitHub

### 6. The Two Project Rules
Two rules run across the whole project, from the first task to the last.

- **The naming rule.** Every file, every document, and every repository that is submitted takes a name in this form: *Student ID-ShopSphere*.
- **The visibility rule.** Anything the student did has to appear in the deliverable itself: a working link, an endpoint that responds, a file that exists, or a log line that shows.

### 7. Learning Outcomes
By the end of the project the student will be able to do nine specific things:

1. Deploy a complete full-stack application to a production environment.
2. Configure and connect a managed cloud database in production.
3. Secure a production environment using environment variables, secrets management, and standard HTTP protections.
4. Classify cloud services by their service model.
5. Represent a deployed system in an architecture diagram.
6. Apply Kubernetes concepts through a namespace-based multi-cloud simulation.
7. Convert a monolithic application into an independently deployed service.
8. Implement a serverless function for a background workload.
9. Build a CI/CD pipeline with secured secrets, structured logging, and a documented rollback plan.

### 8. Summary
ShopSphere Enterprise Production and Cloud Modernization is the final project of Level 5. It continues from the ShopSphere platform built in the first semester and prepares that same application for a secure, scalable, and continuously available production environment.

The work is divided into four tasks that form one continuous journey: production deployment, cloud preparation, application modernization, and production operations. Each task is evaluated on the deliverable of the task before it, so they are worked in order. The tools are fixed, and two rules run across everything: the *Student ID-ShopSphere* naming convention, which is graded in every task, and the requirement that every claim be visible in the deliverable itself.
