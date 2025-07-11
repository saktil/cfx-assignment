# cfx-assignment

# Monorepo CI/CD on DigitalOcean Kubernetes

A production-ready CI/CD pipeline for a monorepo with two microservices (Go and Node.js) automatically deployed to DigitalOcean Kubernetes using GitHub Actions.

## 🚀 Features

- **Smart Builds**: Only builds and deploys services that have changed
- **Containerized**: Docker multi-stage builds for minimal, secure images
- **Auto-Deployment**: GitHub Actions automatically deploys to Kubernetes
- **Production Ready**: Health checks, resource limits, and proper scaling

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions pipeline
├── apps/
│   ├── go-service/             # Go microservice
│   │   ├── Dockerfile
│   │   ├── main.go
│   │   └── go.mod
│   └── node-service/           # Node.js microservice
│       ├── Dockerfile
│       ├── package.json
│       └── server.js
├── infra/
│   └── kubernetes/
│       ├── base/               # Base Kubernetes manifests
│       │   ├── go-deployment.yml
│       │   ├── go-service.yml
│       │   ├── node-deployment.yml
│       │   ├── node-service.yml
│       │   ├── loadbalancer.yml
│       │   └── kustomization.yml
│       └── overlays/
│           └── production/     # Production-specific configs
│               ├── kustomization.yml
│               └── replica-patch.yml
├── .dockerignore
└── README.md
```

## 🛠️ Technology Stack

| Technology | Purpose | Why? |
|------------|---------|------|
| **Go** | Backend Service | Fast, compiled, minimal footprint |
| **Node.js** | Backend Service | JavaScript ecosystem, Express framework |
| **Docker** | Containerization | Consistent deployments, multi-stage builds |
| **Kubernetes** | Orchestration | Auto-scaling, health checks, service discovery |
| **GitHub Actions** | CI/CD | Native GitHub integration, matrix builds |
| **Kustomize** | Config Management | Environment-specific configurations |
| **DigitalOcean** | Cloud Provider | Simple, cost-effective Kubernetes |

## Quick Start

### Prerequisites

- GitHub account
- DigitalOcean account with Kubernetes cluster
- `kubectl` and `doctl` installed locally

### 1. Clone and Setup

```bash
git clone https://github.com/saktil/cfx-assignment.git
cd cfx-assignment
```

### 2. Configure GitHub Secrets

Add these secrets in GitHub Settings → Secrets and variables → Actions:

- `DIGITALOCEAN_ACCESS_TOKEN`: DigitalOcean API token

### 3. Update Configuration

Update the registry and cluster names in:
- `.github/workflows/ci-cd.yml`
- `infra/kubernetes/base/*.yml`
- `infra/kubernetes/overlays/production/kustomization.yml`

### 4. Deploy

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

Watch the GitHub Actions tab for the pipeline execution!

## 🔄 How It Works

### 1. Change Detection
The pipeline uses `dorny/paths-filter` to detect which services have changed:
```yaml
filters: |
  go-service:
    - 'apps/go-service/**'
  node-service:
    - 'apps/node-service/**'
```

### 2. Matrix Builds
Only changed services are built using GitHub Actions matrix strategy:
```yaml
strategy:
  matrix:
    service: ${{ fromJson(needs.changes.outputs.services) }}
```

### 3. Docker Build & Push
Multi-stage Dockerfiles create minimal production images:
```dockerfile
# Go service: From ~800MB to ~10MB
FROM golang:1.21-alpine AS builder
# ... build steps
FROM alpine:latest
COPY --from=builder /app/go-service .
```

### 4. Kubernetes Deployment
Kustomize manages environment-specific configurations:
```yaml
# Production overlay increases replicas
spec:
  replicas: 2
```

## 🌐 Services

### Go Service
- **Port**: 8080
- **Endpoints**:
  - `GET /` - Hello message with hostname
  - `GET /healthz` - Health check
- **Features**: Minimal binary, health probes, resource limits

### Node.js Service  
- **Port**: 3000
- **Endpoints**:
  - `GET /` - JSON response with service info
  - `GET /healthz` - Health check
- **Features**: Express framework, non-root user, health probes

## 🔗 Accessing Services

After deployment, get the load balancer IPs:

```bash
kubectl get svc go-service-lb node-service-lb

# Test the services
curl http://170.64.250.19  # Go service
curl http://170.64.246.138/  # Node service
```

## 🚀 Deployment Pipeline

The CI/CD pipeline runs on every push to `main`:

1. **Changes Detection** (10s)
   - Scans for changes in service directories
   - Outputs JSON array of changed services

2. **Build & Push** (2-5 min)
   - Builds Docker images for changed services only
   - Pushes to DigitalOcean Container Registry
   - Tags with both `latest` and git SHA

3. **Deploy** (30s-2 min)
   - Updates Kubernetes manifests with new image tags
   - Applies changes using `kubectl apply -k`
   - Waits for rollout completion
   - Verifies deployment health

## Monitoring & Observability

### Health Checks
All services include Kubernetes health probes:
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
readinessProbe:
  httpGet:
    path: /healthz
    port: 8080
```

### Resource Monitoring
```bash
# Check pod resource usage
kubectl top pods

# Check node resource usage  
kubectl top nodes

# View pod logs
kubectl logs -l app=go-service --tail=20
```

### Cluster Status
```bash
# Overall cluster health
kubectl get all -l environment=production

# Check deployment status
kubectl get deployments

# View recent events
kubectl get events --sort-by=.metadata.creationTimestamp
```

## 🔧 Development Workflow

### Making Changes

1. **Edit a service**:
   ```bash
   # Modify apps/go-service/main.go
   vim apps/go-service/main.go
   ```

2. **Commit and push**:
   ```bash
   git add apps/go-service/
   git commit -m "Update go service response"
   git push origin main
   ```

3. **Monitor deployment**:
   - Check GitHub Actions tab
   - Only `go-service` will be rebuilt
   - Deployment automatically updates

### Local Testing

```bash
# Test Go service locally
cd apps/go-service
go run main.go

# Test Node service locally  
cd apps/node-service
npm install
npm start

# Build Docker images locally
docker build -t go-service apps/go-service/
docker build -t node-service apps/node-service/
```

#### Pipeline Fails
```bash
# Check GitHub Actions logs
# Common issues:
# 1. DIGITALOCEAN_ACCESS_TOKEN not set
# 2. Registry permissions
# 3. Cluster access issues
```

#### Pods Not Starting
```bash
# Check pod status
kubectl get pods -l environment=production

# Check pod logs
kubectl logs deployment/go-service-deployment

# Check events
kubectl describe pod <pod-name>
```

#### Services Not Accessible
```bash
# Check load balancer status
kubectl get svc -o wide

# Check endpoints
kubectl get endpoints

# Port forward for testing
kubectl port-forward service/go-service 8080:80
curl http://localhost:8080
```

#### Images Not Pulling
```bash
# Check if images exist in registry
doctl registry repository list-tags cfx/go-service

# Check registry credentials
kubectl get secrets
```

### Debug Commands

```bash
# Full cluster overview
kubectl get all --all-namespaces

# Resource usage
kubectl describe nodes

# Pod detailed info
kubectl describe deployment go-service-deployment

# Network debugging
kubectl run debug --image=alpine --rm -it -- /bin/sh
```