# PowerShell helper to port-forward and test services for both namespaces
param(
  [string]$namespace = 'aws-simulation',
  [string]$service = 'backend-service',
  [int]$localPort = 8081,
  [int]$remotePort = 80
)

Write-Host "Port-forwarding $service in namespace $namespace to localhost:$localPort"
kubectl port-forward -n $namespace svc/$service $localPort:${remotePort}
