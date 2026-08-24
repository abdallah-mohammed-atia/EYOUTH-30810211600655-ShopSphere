# Rubric and Scoring — ShopSphere

## 1. How the Scoring Works
This reading explains how the ShopSphere project is assessed. It begins with the scoring system and the meaning of an acceptance criterion, and then works through the rubric task by task, setting out each sub-task and the exact condition on which it is accepted. What is described here is what determines the final mark.

Assessment in this project follows a clear system. Every criterion in the rubric has two possible outcomes only: one point or zero. One point if the criterion was carried out correctly and completely, and zero if it was incomplete, only partly met, or wrong.

Figure 1
Figure 1. Every rubric item is worth one point or zero, with nothing in between.
There is no half point at all, so half-finished work does not earn half a mark. If a criterion contains more than one part and only one of them was achieved, it scores zero.

Central idea

The scoring is binary by design. A criterion is either demonstrably met in full or it is not met, and there is no middle result to aim for.

## 2. What Every Criterion Measures
Each criterion is read as a single statement rather than as a list of separate chances. All of the elements it names must be present at the same time, and the result must be visible in the deliverable itself.

This is the same visibility rule that governs the whole project: a working link, an endpoint that responds, a file that exists, or a log line that shows. Work that cannot be reached and seen in the submitted deliverables is not counted.

## 3. The Repeated File-Naming Criterion
One condition repeats across all four tasks: that the name is written in the required form, *Student ID-ShopSphere*.

In the first three tasks it sits inside the first criterion of the task. In Task 4 it sits inside the project sharing criterion, because there the document itself is what carries the name. Naming is therefore assessed four separate times across the project, and a mistake in it costs a point in each task where it occurs.

## 4. Each Task Is Judged on the One Before It
One feature belongs to this project in particular: every task is assessed on the deliverable produced by the task before it.

The assessment of Task 2 is carried out on a diagram that describes the real deployment from Task 1. The assessment of Task 4 runs on the production environment of Task 1 itself, and its rollback plan is judged against the monitoring configured there.

An unfinished task costs twice

A task left incomplete does not only lose its own criteria. It also makes the criteria of the tasks that follow it harder to satisfy, because they are measured against what it was supposed to produce.

## 5. Task 1: Production Deployment
These are the four criteria belonging to Task 1.

Figure 2
Figure 2. The acceptance criteria for the four sub-tasks of Task 1.
Sub-task	The acceptance criterion
Production deployment	The frontend and the backend are both live and reachable through public URLs; the application loads with no build errors and no runtime errors; and the files follow the naming convention.
Production database	The application reads from and writes to PostgreSQL on Supabase, and the deployed application uses no local or development database.
Secrets and security	No secret value appears anywhere in the repository; the application is served over HTTPS; and CORS, Helmet, and rate limiting are each active on the deployed backend.
Health check and monitoring	The endpoint returns a success response from the public URL, and the monitoring service is registered on it and reports the status of the service.

In the security criterion the operative words are “each active”. All three of the remaining protections are required together, so two of them working and the third not means the criterion does not pass.

## 6. Task 2: Cloud Preparation
These are the three criteria belonging to Task 2.

Figure 3
Figure 3. The acceptance criteria for the three sub-tasks of Task 2.
Sub-task	The acceptance criterion
Architecture diagram	The diagram shows the frontend, the backend, the database, and the traffic path between them; it matches the deployment delivered in Task 1; and the file follows the naming convention.
Cloud service classification	All three services carry a classification, each classification is correct, and each one carries a one-line reason.
Namespace simulation	Both namespaces exist under the required names; each runs a frontend pod and a backend pod, each exposed through a service; the services in both respond through `kubectl port-forward`; and the resources in one namespace are not visible from the other.

The namespace criterion holds four conditions in a single row, and all four have to be satisfied together.

## 7. Task 3: Application Modernization
These are the four criteria belonging to Task 3.

Figure 4
Figure 4. The acceptance criteria for the four sub-tasks of Task 3.
Sub-task	The acceptance criterion
Review service extraction	The review service is deployed and reachable at its own URL; the review logic no longer runs inside the main application; and the service files follow the naming convention.
REST communication	The reviews shown in ShopSphere are retrieved from the review service through REST calls, and the main application still works end to end after the extraction.
Serverless integration	The function is deployed on Vercel and executes successfully, and the work it performs runs outside the main application.
Architecture decision record	The document names the extracted service and the reason it was a suitable candidate, names the serverless workload and the reason serverless suits it, and does not exceed one page.

## 8. Task 4: Production Operations
These are the four criteria belonging to Task 4.

Figure 5
Figure 5. The acceptance criteria for the four sub-tasks of Task 4.
Sub-task	The acceptance criterion
CI/CD pipeline and secrets	The three environments exist, each with its own variables; a pipeline run installed, built, and deployed, reaching the Task 1 production environment; no credential appears in the workflow file or in the run logs; and `main` accepts a merge only after the pipeline succeeds.
Structured logging	Request entries and error entries carry a timestamp and a severity level, and the place where the logs are read in production is stated.
Rollback plan	The plan states how a failed release is detected from the Task 1 monitoring and the steps that restore the previous working version, within one page.
Project sharing	The document is named *Student ID-ShopSphere*, holds the application, review service, and repository URLs, and is viewable by anyone with the link.

The first of these is the largest criterion in the whole project, with four conditions that have to hold together. In this task the naming condition sits inside the project sharing criterion.

## 9. Using the Rubric as a Live Checklist
The last point is the most useful one. The rubric is not a surprise waiting at the end of the project. It is used as a checklist while the work is still going on, sub-task after sub-task and criterion after criterion.

Figure 6
Figure 6. The two questions to ask of every rubric item while the work is in progress.
Two questions are asked of every item.

1. Was this item carried out in full?
2. Can the evaluator see it in my work without me explaining it?
If an item answers no to either question, the student returns to that task and finishes it before submitting.

## 10. Summary
Every criterion in the ShopSphere rubric is worth one point or zero, with no partial credit, and a criterion that contains several conditions is read as one statement in which all of them must hold. The naming condition, *Student ID-ShopSphere*, is graded four separate times: inside the first criterion of each of the first three tasks, and inside the project sharing criterion of Task 4.

The rubric covers fifteen criteria in total: four for Task 1, three for Task 2, four for Task 3, and four for Task 4. Because each task is assessed on the deliverable of the one before it, an unfinished task costs more than its own criteria.

The rubric is most useful while the work is still in progress. Reading each criterion alongside the work, and asking whether it is complete and whether an evaluator can see it unaided, is what turns finished work into a graded point.
