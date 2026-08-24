# Task 3 — Application Modernization (At a Glance)

## 1. Task 3 at a Glance
This reading covers the third task of the ShopSphere project. The task is about changing the shape of the application itself. Up to this point ShopSphere is a **monolith**: one large application with everything inside it. What is asked now is to begin taking it apart, by lifting one part of it out as an independent service and by moving a background workload to serverless.

The required deliverable is **a modernized version of ShopSphere running as the main application, together with an independently deployed review service and one serverless function**.

Four things are required: extract the review service, connect it to the main application, implement a serverless function, and write an architecture decision. They are divided across four sub-tasks.

Figure 1
Figure 1. The four sub-tasks that make up Task 3.
Sub-task	Title	Environment
3.1	Review Service Extraction	A separate codebase and a separate deployment
3.2	REST Communication	The main application and the review service
3.3	Serverless Integration	Vercel Serverless Functions
3.4	Architecture Decision Record	A one-page document

## 2. Sub-task 3.1: Review Service Extraction
The first step is the extraction. The student reviews the ShopSphere monolith deployed in Task 1, and the part to be taken out is specified: the **reviews** functionality.

Figure 2
Figure 2. The reviews functionality lifted out of the monolith into an independently deployed service.
It is extracted into an independent **review service** that has its own codebase and its own deployment. The service has to be genuinely deployed and reachable at a URL of its own.

A second condition is the most important one in this sub-task: **the review logic no longer runs inside the main application**. The code is not copied into two places with both copies left running. This is a move, not a duplication.

The files of the service follow the project naming convention, *Student ID-ShopSphere*, like every other file in the project.

## 3. Sub-task 3.2: REST Communication
The second sub-task is the communication between the two. The main application is connected to the review service through **REST endpoints**.

Figure 3
Figure 3. Reviews retrieved from the review service through REST calls, with the main application still working end to end.
What is required is that the reviews appearing in ShopSphere genuinely arrive from the review service through REST calls, rather than from anything still held inside the main application.

A further condition matters a great deal here: the main application has to keep working end to end after the extraction. Taking one part of an application apart is not allowed to break the rest of it.

Test the whole journey

After the extraction is finished, the complete user journey through ShopSphere is exercised, not only the reviews page. The criterion is about the application as a whole.

## 4. Sub-task 3.3: Serverless Integration
The third sub-task is the serverless part. The student implements **one serverless function** on Vercel that performs a background workload for ShopSphere.

Figure 4
Figure 4. One serverless function deployed on Vercel, running a background workload outside the main application.
Two conditions apply. The function has to be deployed on Vercel and to execute successfully in practice. And the work it performs has to run **outside the main application**, which is precisely what this item measures.

## 5. Sub-task 3.4: Architecture Decision Record
The last part of the task is the **architecture decision record**, usually shortened to **ADR**. The student writes a document of no more than one page that states three things: which part was moved into a microservice, which workload was moved to serverless, and the reason behind each of the two decisions.

Figure 5
Figure 5. The three things the architecture decision record must state, within one page.
The criterion measures three conditions. The document names the extracted service and says why it was a suitable candidate for extraction. It names the serverless workload and says why serverless suits that workload in particular. And it does not exceed one page.

The page limit is a written criterion

The one-page limit is part of the criterion rather than a piece of advice. A two-page document scores zero on this item regardless of what it contains.

## 6. Acceptance Criteria for Task 3
The rubric assesses this task with four criteria, one for each sub-task, and each of them is worth either one point or zero.

Sub-task	What the criterion requires
Review service extraction	The review service is deployed and reachable at its own URL; the review logic no longer runs inside the main application; and the service files follow the *Student ID-ShopSphere* naming convention.
REST communication	The reviews shown in ShopSphere are retrieved from the review service through REST calls, and the main application still works end to end after the extraction.
Serverless integration	The function is deployed on Vercel and executes successfully, and the work it performs runs outside the main application.
Architecture decision record	The document names the extracted service and the reason it was a suitable candidate, names the serverless workload and the reason serverless suits it, and does not exceed one page.

## 7. Summary
Task 3 changes the internal shape of ShopSphere. The reviews functionality leaves the monolith and becomes an independently deployed service with its own codebase and its own URL, and the review logic stops running inside the main application altogether. The two then talk to each other through REST endpoints, with the reviews shown in ShopSphere arriving from the service, and with the rest of the application still working end to end.

Alongside the extraction, one background workload moves to a Vercel serverless function that is deployed, executes successfully, and runs outside the main application. The architecture decision record then puts both moves on paper: what was extracted, what was moved to serverless, and why each decision was made, all within one page.

The full submission details, from file names to sharing settings, are given in the reading on project submission.
