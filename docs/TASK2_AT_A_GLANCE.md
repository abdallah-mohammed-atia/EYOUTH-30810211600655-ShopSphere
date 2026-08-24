# Task 2 — Cloud Preparation (At a Glance)

## 1. Task 2 at a Glance
This reading covers the second task of the ShopSphere project. The task is about the cloud environment the application runs inside. In Task 1 the application was actually deployed; what is asked now is to understand that shape, document it, and simulate a larger environment around it.

The required deliverable is a cloud-ready architecture for ShopSphere, together with a simplified multi-cloud simulation running on two Kubernetes namespaces.

Three things are required: draw the architecture diagram, classify the cloud services, and build the multi-cloud simulation. They are divided across three sub-tasks.

Figure 1
Figure 1. The three sub-tasks that make up Task 2.
Sub-task	Title	Environment
2.1	Architecture Diagram	A diagramming tool, describing the Task 1 deployment
2.2	Cloud Service Classification	A written document
2.3	Multi-Cloud Namespace Simulation	Kubernetes, with kubectl

## 2. Sub-task 2.1: Architecture Diagram
The first step is the diagram. The student draws an architecture diagram of the production deployment delivered in Task 1.

Figure 2
Figure 2. The four things the architecture diagram must show, matching the Task 1 deployment.
The diagram has to show four things: the frontend, the backend, the database, and the traffic path that connects them. The three components on their own are not enough; the route that ties them together in the student’s own deployment has to appear as well.

One condition matters more than the rest: the diagram must match the deployment that was actually delivered in Task 1. It is not a model diagram taken from the internet, and not an architecture the student would have liked to build. The diagram describes the student’s own system.

The diagram file itself follows the project naming convention, Student ID-ShopSphere, like every other file in the project.

The diagram is evidence, not decoration

Because the deployment from Task 1 is a real system with public URLs, the diagram can be compared against it directly. A diagram that describes a different architecture from the one deployed does not pass.

## 3. Sub-task 2.2: Cloud Service Classification
The second sub-task is the classification of the services. Three services are in use in this project: the frontend hosting, the backend hosting, and the Supabase database.

Figure 3
Figure 3. The three services to classify, each with its service model and a one-line reason.
Each of the three is classified by its service model: IaaS, PaaS, or SaaS. Alongside every classification the student writes a single line saying why the service was classified that way.

This item measures three things at once: that all three services carry a classification, that each classification is correct, and that each classification is accompanied by its one-line reason. A correct classification with no reason does not complete the item, and a written reason attached to a wrong classification does not complete it either.

## 4. Sub-task 2.3: Multi-Cloud Namespace Simulation
The last part of the task is the multi-cloud simulation, and it is the largest part of it. The idea is to simulate working across different cloud providers, using namespaces inside Kubernetes.

The two namespaces. Create two namespaces under exactly these names: `aws-simulation` and `gcp-simulation`. These names are not a suggestion. They are the required names, and the criterion checks them literally.

The manifests. Write the Kubernetes manifests that create a frontend pod, a backend pod, and their services, and apply them inside each of the two namespaces. Each namespace runs its own pods, and each pod is exposed through a service of its own.

Figure 4
Figure 4. Two isolated namespaces, each running its own frontend and backend pods behind services.
The services must respond. Once they are running, reach the services in both namespaces using `kubectl port-forward`. They have to answer in practice, not merely appear in the output of a listing command.

The isolation condition. A fourth condition applies: resources created in one namespace must not be visible from the other. This isolation is itself a measured item, so it is worth verifying before submitting rather than assuming it.

Four conditions in one row

The namespaces under the required names, the pods and services in both, the response through kubectl port-forward, and the isolation between them are read together as one criterion. All four have to hold at the same time.

## 5. Acceptance Criteria for Task 2
The rubric assesses this task with three criteria, one for each sub-task, and each of them is worth either one point or zero.

Sub-task	What the criterion requires
Architecture diagram	The diagram shows the frontend, the backend, the database, and the traffic path between them; it matches the deployment delivered in Task 1; and the file follows the Student ID-ShopSphere naming convention.
Cloud service classification	All three services carry a classification, each classification is correct, and each one is accompanied by a one-line reason.
Namespace simulation	Both namespaces exist under the required names; each runs a frontend pod and a backend pod, each exposed through a service; the services in both respond through kubectl port-forward; and the resources in one namespace are not visible from the other.
The namespace criterion carries four conditions in a single row, and they are read together rather than separately.

## 6. Summary
Task 2 turns the deployment produced in Task 1 into something documented and understood. The architecture diagram records the frontend, the backend, the database, and the traffic path of the student’s own deployment, and it is judged against that deployment rather than against a generic reference model. The classification exercise takes the three cloud services in use and places each one in its service model with a one-line justification.

The simulation then puts Kubernetes concepts to work: two namespaces under the fixed names `aws-simulation` and `gcp-simulation`, each running its own frontend and backend pods behind services, each reachable through `kubectl port-forward`, and each isolated from the other.

The full submission details, from file names to sharing settings, are given in the reading on project submission.
