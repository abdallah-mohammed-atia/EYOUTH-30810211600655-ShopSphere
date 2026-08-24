# Task 4 — Production Operations (At a Glance)

## 1. Task 4 at a Glance
This reading covers the fourth and last task of the ShopSphere project. The task is about the operating practices that are put around an application once it is in production: how a new release reaches production safely, how a problem becomes known, and how the system is taken back if one occurs.

The required deliverable is **a production-ready ShopSphere application, deployed through an automated pipeline, with logging, monitoring, and rollback around it**.

Four things are required: build the CI/CD pipeline, add structured logging, document a rollback plan, and gather the project links. They are divided across four sub-tasks.

Figure 1
Figure 1. The four sub-tasks that make up Task 4.
Sub-task	Title	Environment
4.1	CI/CD Pipeline and Secrets	GitHub Actions, and the Task 1 production environment
4.2	Structured Logging	The deployed backend
4.3	Rollback Plan	A one-page document
4.4	Project Sharing	A single shareable document

## 2. Sub-task 4.1: CI/CD Pipeline and Secrets
The first step covers the environments and the pipeline, and it is the largest part of the task.

**The three environments.** Three environments are configured for ShopSphere: **development**, **staging**, and **production**. Each of them carries its own set of environment variables, so the three exist in fact and the variables of each one are separate from the others.

Figure 2
Figure 2. Three environments, each with its own set of environment variables.
**The pipeline.** A CI/CD pipeline is then built on **GitHub Actions**. It performs three steps: it installs the dependencies, it builds the application, and it deploys to production when a merge lands on the `main` branch.

There has to be a complete pipeline run that finished all three steps and reached the production environment from Task 1. A pipeline that was written but never ran, or that ran and stopped halfway, does not complete this item.

Figure 3
Figure 3. The pipeline: install, build, and deploy to production on a merge into main, with secrets and branch protection.
**Securing the pipeline** has two parts. The first is that the pipeline credentials are stored as **GitHub Actions secrets**, with the requirement that no credential appears in the workflow file and none appears in the pipeline run logs. Both places are checked. The second is branch protection: the `main` branch accepts a merge only after the pipeline succeeds.

Four conditions in one criterion

The three environments with their separate variables, the complete run that reached production, the absence of credentials in both the workflow file and the run logs, and the protected `main` branch are read together. This is the largest single criterion in the project.

## 3. Sub-task 4.2: Structured Logging
The second sub-task is logging. **Structured logging** is added to the backend so that requests and errors are emitted with a **timestamp** and a **severity level**.

Figure 4
Figure 4. Request entries and error entries carrying a timestamp and a severity level, with the place they are read stated.
The criterion checks both kinds of entry: the request entries and the error entries. Both have to carry the time and the level.

A second condition is written into the criterion as well: the student states **where these logs are read in production**. Logging that runs while nobody knows where to look at it does not help anyone at the moment a problem appears.

## 4. Sub-task 4.3: Rollback Plan
The third sub-task is the **rollback plan**. The student documents a plan of no more than one page for a release that failed after it was deployed.

Figure 5
Figure 5. The rollback plan: detecting a failed release through the Task 1 monitoring, then restoring the previous working version.
The plan states two things. The first is how the failed release is detected, through the **monitoring configured in Task 1**. This is the point at which the value of Task 1 becomes visible: the monitoring set up there is the detection instrument here.

The second is the steps that restore production to the previous working version. These are the steps somebody would actually carry out at the moment of the problem, rather than general remarks about why rollback matters.

The one-page limit is written into this criterion as well.

## 5. Sub-task 4.4: Project Sharing
The last part of the task is gathering the project links. The links of the **application**, the **review service**, and the **repository** are collected into a single document.

Figure 6
Figure 6. The project links document holding the application, review service, and repository URLs.
The document is named *Student ID-ShopSphere*, like every other file in the project, and it has to be viewable by anyone who holds the link. All three links have to be present inside it.

A missing link is unseen work

A link that is absent from the document means that part of the student’s work is never reached during the evaluation, however complete the work behind it may be.

## 6. Acceptance Criteria for Task 4
The rubric assesses this task with four criteria, one for each sub-task, and each of them is worth either one point or zero.

Sub-task	What the criterion requires
CI/CD pipeline and secrets	The three environments exist, each with its own variables; a pipeline run installed, built, and deployed, reaching the Task 1 production environment; no credential appears in the workflow file or in the run logs; and `main` accepts a merge only after the pipeline succeeds.
Structured logging	Request entries and error entries carry a timestamp and a severity level, and the place where the logs are read in production is stated.
Rollback plan	The plan states how a failed release is detected from the Task 1 monitoring and the steps that restore the previous working version, within one page.
Project sharing	One document named *Student ID-ShopSphere* holds the application, review service, and repository URLs, and is viewable by anyone with the link.

In this task the naming criterion sits inside the project sharing item rather than at the head of the task, because the document itself is what carries the name.

## 7. Summary
Task 4 puts the operating practices around ShopSphere. Three environments are configured with separate variables, and a GitHub Actions pipeline installs, builds, and deploys to the production environment from Task 1 whenever a merge lands on `main`. The pipeline is secured with GitHub Actions secrets, with nothing exposed in the workflow file or the run logs, and `main` is protected so that only a successful pipeline can be merged into it.

Structured logging then makes the running system readable: requests and errors carry a timestamp and a severity level, and the place they are read in production is stated. The rollback plan closes the loop opened in Task 1, using the monitoring configured there to detect a failed release and setting out the steps that restore the previous working version. Finally the application, review service, and repository links are gathered into one shareable document.

With this task the four tasks of the project are complete. The reading on the rubric explains how the work is assessed, and the reading on project submission explains how it is handed in.
