Kubernetes multi-cloud namespace simulation

This folder contains manifests and scripts to create two namespaces (`aws-simulation` and `gcp-simulation`) and deploy a simple frontend and backend in each. The services use lightweight containers for easy testing.

To apply (requires `kubectl` and a cluster like minikube or Docker Desktop):

```bash
kubectl apply -f k8s/namespaces.yaml
kubectl apply -f k8s/aws-simulation/deployment-backend.yaml
kubectl apply -f k8s/aws-simulation/deployment-frontend.yaml
kubectl apply -f k8s/gcp-simulation/deployment-backend.yaml
kubectl apply -f k8s/gcp-simulation/deployment-frontend.yaml
```

Port-forward example to verify the backend in `aws-simulation`:

```bash
kubectl port-forward -n aws-simulation svc/backend-service 8081:80
curl http://localhost:8081/health
```

The `test-port-forward.ps1` script provides a PowerShell convenience command for Windows.
