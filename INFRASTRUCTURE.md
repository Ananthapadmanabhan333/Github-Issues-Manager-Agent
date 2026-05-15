# Cognition OS: Infrastructure & Deployment

## 18. Frontend Architecture

The frontend is a cinematic, AI-native developer workspace built for speed and aesthetics.
- **Framework:** Next.js 15 (App Router).
- **Styling:** Tailwind CSS + custom glassmorphism utilities + dark mode optimized HSL palettes.
- **Components:** shadcn/ui for accessible, premium building blocks.
- **Data Fetching:** React Query for caching + standard fetch APIs. WebSockets for real-time AI updates.
- **Visualizations:** React Flow for Holographic Issue Dependency Graphs, Recharts for Sprint Analytics.
- **State Management:** Zustand for lightweight global state (e.g., active workspace, selected bug cluster).

## 19. Backend Architecture

A high-performance asynchronous python backend optimized for AI orchestration.
- **API Framework:** FastAPI.
- **Agent Framework:** LangGraph / LangChain.
- **LLM Engine:** OpenAI API (`gpt-4o`, `gpt-4o-mini`).
- **WebSockets:** FastAPI WebSockets for streaming agent thought processes and telemetry to the client.
- **Workers:** Celery + Redis for async background tasks (e.g., repository ingestion, AST parsing).

## 20. Folder Structure

```text
cognition-os/
├── backend/
│   ├── app/
│   │   ├── api/            # FastAPI routes
│   │   ├── core/           # Config, security, DB setup
│   │   ├── agents/         # LangGraph workflows (triage, pr_gen, rca)
│   │   ├── services/       # GitHub/Jira API wrappers, ingestion logic
│   │   ├── models/         # SQLAlchemy schemas
│   │   └── worker.py       # Celery worker entrypoint
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # UI components (shadcn, charts, visualizations)
│   │   ├── lib/            # Utilities, API clients, WebSocket hooks
│   │   └── store/          # Zustand stores
│   ├── tailwind.config.ts
│   └── package.json
├── infra/
│   ├── terraform/          # AWS/GCP provisioning scripts
│   ├── k8s/                # Kubernetes manifests & Helm charts
│   └── docker-compose.yml  # Local development stack
├── .github/
│   └── workflows/          # CI/CD pipelines
└── README.md
```

## 21. Database Schema

**PostgreSQL (Relational Metadata):**
- `Workspace`: ID, Name, CreatedAt
- `Repository`: ID, WorkspaceID, Name, GitHubURL
- `Issue`: ID, RepoID, Title, Status, Priority, StoryPoints, AssigneeID, SemanticClusterID
- `Developer`: ID, WorkspaceID, Name, GitHubUsername, ProductivityScore
- `Deployment`: ID, RepoID, Environment, Status, RiskScore

**Qdrant (Vector Database):**
- Collection: `issue_embeddings` (Payload: Issue ID, Status)
- Collection: `code_embeddings` (Payload: FilePath, FunctionName, RepoID)

**Neo4j (Graph Database):**
- Nodes: `Developer`, `Issue`, `PR`, `CodeFile`.
- Relationships: `(Developer)-[:WROTE]->(PR)-[:MODIFIES]->(CodeFile)`, `(PR)-[:RESOLVES]->(Issue)`.

## 22. API Routes

- `POST /api/v1/webhooks/github` - Main ingestion endpoint for GitHub events.
- `GET /api/v1/issues/clusters` - Retrieves semantically grouped bugs.
- `POST /api/v1/agents/rca` - Triggers the Root-Cause Analysis agent.
- `POST /api/v1/agents/fix` - Triggers autonomous PR generation.
- `GET /api/v1/analytics/dora` - Retrieves sprint DORA metrics.

## 23. WebSocket Events

- `agent_thought`: Streams internal reasoning of an AI agent.
- `issue_triaged`: Pushed to client when a new issue is autonomously labeled and prioritized.
- `pr_generated`: Alerts the UI that a PR has been opened by Cognition.
- `cluster_updated`: Real-time updates when an issue is merged into a semantic cluster.

## 24. Queue Infrastructure

- **Kafka Topics:** `ingest-github`, `ingest-jira`, `process-ast`.
- **Redis Queues (Celery):** `high-priority-agents`, `low-priority-indexing`.
- **Handling:** Failed LLM calls are placed in a dead-letter queue (DLQ) with exponential backoff retries.

## 25. Docker Infrastructure

`docker-compose.yml` components for local dev:
1. `cognition-frontend` (Next.js)
2. `cognition-backend` (FastAPI)
3. `cognition-worker` (Celery)
4. `postgres` (Relational DB)
5. `redis` (Broker & Cache)
6. `qdrant` (Vector DB)
7. `neo4j` (Graph DB)
8. `kafka` & `zookeeper` (Event Bus)

## 26. Kubernetes Deployment

Production deployment uses Helm charts.
- **Autoscaling:** HPA on Celery workers based on Redis queue length.
- **Ingress:** NGINX Ingress Controller routing `/api` to backend and `/` to frontend.
- **StatefulSets:** For Postgres, Qdrant, and Neo4j (backed by AWS EBS/GCP Persistent Disks).

## 27. Terraform Infrastructure

Provisions cloud infrastructure (e.g., AWS):
- **EKS Cluster:** Managed Kubernetes.
- **RDS:** Managed PostgreSQL for high availability.
- **MSK / ElastiCache:** Managed Kafka and Redis.
- **S3:** For storing large AST dumps and CI/CD logs.

## 28. CI/CD Pipelines

Powered by GitHub Actions:
- `build-and-test.yml`: Runs PyTest (backend) and Jest (frontend) on PRs. Performs Semgrep static analysis.
- `build-docker.yml`: Builds and pushes images to ECR/GCR on merge to main.
- `deploy-k8s.yml`: Updates Helm charts and triggers ArgoCD sync for GitOps deployment.

## 29. Performance Optimization

- **Vector Sharding:** Qdrant collections are sharded across nodes to support millions of embeddings.
- **Repository Caching:** Redis caches heavily accessed AST structures and recent commits.
- **Async DB Calls:** SQLAlchemy async engine prevents I/O blocking during API ingestion.
- **Edge Caching:** Next.js uses Vercel Edge functions / CDN for static frontend assets.

## 30. .env.example

```ini
# Core Configuration
ENVIRONMENT=production
SECRET_KEY=super-secret-key

# Database Connections
POSTGRES_URL=postgresql+asyncpg://user:pass@db:5432/cognition
REDIS_URL=redis://redis:6379/0
QDRANT_URL=http://qdrant:6333
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=secret

# AI Models
OPENAI_API_KEY=sk-...

# Integrations
GITHUB_WEBHOOK_SECRET=...
GITHUB_APP_PRIVATE_KEY=...
```
