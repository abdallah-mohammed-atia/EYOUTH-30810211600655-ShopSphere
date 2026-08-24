# ShopSphere Enterprise Production and Cloud Modernization — Project Overview

## 1. Project Context and Purpose
This reading introduces the Level 5 final project, **ShopSphere Enterprise Production and Cloud Modernization**. It explains what the project is, what it continues from, how the work is divided into four tasks, which technologies are used, and the two rules that govern every part of it. Each task has a full reading of its own, and this document is the general introduction to all of them.

The stage the student has now reached is not a stage of new lessons. It is the final project of the level, and its official name is the ShopSphere Enterprise Production and Cloud Modernization project.

Because this is the final project of the level, it gathers the skills of the whole level and applies them to one real application. The readings that follow take each task in turn, and after them come the reading on the rubric and the reading on submission.

## 2. Where the Project Starts
This project does not start from nothing. It continues from **ShopSphere**, the e-commerce platform the student built in the first semester. The application already exists and already works, and what is asked now is something different in kind: preparing it for production.

Figure 1
Figure 1. The project continues from the ShopSphere platform delivered in the first semester.
The scenario is that the team has finished developing ShopSphere and intends to release it to real users. For that to happen, the platform has to be ready for a production environment that is secure, scalable, and available at all times.

That is what the project consists of: deploying the application, securing it, monitoring it, changing the shape of its architecture, and building a proper CI/CD pipeline around it.

Central idea

The work of this project is not writing a new application. It is taking an application that already runs and making it fit to run in production, for real users, without supervision.

## 3. One Continuous Project
The project contains four tasks, but they are not four separate exercises. They are one continuous journey from beginning to end. The student starts from the ShopSphere application delivered in the first semester and finishes with that same application running as a production-ready system.

Figure 2
Figure 2. One continuous project: each task is evaluated on the deliverable of the task before it.
Task	What it does to the application
Task 1	Puts the application into production.
Task 2	Documents the cloud environment it runs inside, and simulates a larger one.
Task 3	Changes the shape of the application itself.
Task 4	Puts the operating practices around it.
The most important consequence follows from this: each task is evaluated on the deliverable produced by the task before it. If Task 1 was not finished correctly, the task after it has no ground to stand on.

Work them in order

The tasks are not worked in reverse and not worked in parallel. They run from one to four, in that order.

## 4. The Four Tasks and Their Deliverables
These are the four tasks and the deliverable each one produces.

Figure 3
Figure 3. The four tasks of the project and the deliverable of each one.
Task	Focus	Deliverable
Task 1	Production Deployment	A fully functional production deployment of ShopSphere.
Task 2	Cloud Preparation	A cloud-ready architecture for ShopSphere, together with a simplified multi-cloud simulation.
Task 3	Application Modernization	A modernized version of the ShopSphere application.
Task 4	Production Operations	A ShopSphere application that is genuinely ready for production.
Each of the four has a complete reading and a complete video of its own, so their details are not covered here.

## 5. The Technologies of the Project
The tools used in the project are fixed, and each of them covers one area of the work.

Figure 4
Figure 4. The technologies used in the project, and the area of work each one covers.
Area	Technology
Frontend and backend hosting	Vercel
Production database	PostgreSQL on Supabase
Container orchestration	Kubernetes, with `kubectl`
Serverless	Vercel Serverless Functions
Continuous integration and delivery	GitHub Actions
Uptime monitoring	UptimeRobot, or any equivalent monitoring service
Source control	Git and GitHub
These are the tools of the project. None of them is replaced with something from outside the level.

## 6. The Two Project Rules
Two rules run across the whole project, from the first task to the last.

Figure 5
Figure 5. The two rules that apply to every task in the project.
The naming rule. Every file, every document, and every repository that is submitted takes a name in this form: Student ID-ShopSphere. This rule is a graded item inside each of the four tasks, not a single check at the end of the project.

The visibility rule. Anything the student did has to appear in the deliverable itself: a working link, an endpoint that responds, a file that exists, or a log line that shows. Work that cannot be seen in the deliverable is not counted, even if the student really did it.

The rule that decides marks

The visibility rule is the decisive one. An evaluator marks what can be reached and seen in the submitted work, not what was intended or explained afterwards.

## 7. Learning Outcomes
By the end of the project the student will be able to do nine specific things.

Figure 6
Figure 6. The nine learning outcomes of the ShopSphere project.
Deploy a complete full-stack application to a production environment.
Configure and connect a managed cloud database in production.
Secure a production environment using environment variables, secrets management, and standard HTTP protections.
Classify cloud services by their service model.
Represent a deployed system in an architecture diagram.
Apply Kubernetes concepts through a namespace-based multi-cloud simulation.
Convert a monolithic application into an independently deployed service.
Implement a serverless function for a background workload.
Build a CI/CD pipeline with secured secrets, structured logging, and a documented rollback plan.
Instead of each concept remaining in its own compartment, all of them are seen working together on one real application.

## 8. Summary
ShopSphere Enterprise Production and Cloud Modernization is the final project of Level 5. It continues from the ShopSphere platform built in the first semester and prepares that same application for a secure, scalable, and continuously available production environment.

The work is divided into four tasks that form one continuous journey: production deployment, cloud preparation, application modernization, and production operations. Each task is evaluated on the deliverable of the task before it, so they are worked in order. The tools are fixed, and two rules run across everything: the Student ID-ShopSphere naming convention, which is graded in every task, and the requirement that every claim be visible in the deliverable itself.

The readings that follow take each task in turn, and after them come the reading on the rubric and the reading on submission. Working through them in order gives a clear picture of the project before the work begins.
