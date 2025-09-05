# Hypesoft Product Management System

Modern, production-minded implementation of a full-stack product management system used to demonstrate architecture, performance, security, and usability best practices.

## Overview
- Frontend: Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui, TanStack Query
- Backend: .NET 9, Clean Architecture + CQRS/MediatR, MongoDB, FluentValidation, Serilog
- Auth: Keycloak (OpenID Connect, PKCE, roles, check-sso)
- Infra: Docker, Docker Compose (profiles dev/prod), Nginx reverse proxy, HealthChecks, CORS, rate limiting

## Quickstart (Docker Compose)

1) Prerequisites
- Docker Desktop 4.x
- Git

2) Clone
```bash
git clone https://github.com/your-org/hypesoft-challenge.git
cd hypesoft-challenge
```

3) Environment (optional)
- All services accept environment overrides via .env-style placeholders in `docker-compose.yml`.
- You may create `.env` in the project root to override ports/credentials:
```env
API_PORT=5000
FRONTEND_PORT=3000
KEYCLOAK_PORT=8080
MONGODB_PORT=27017
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=hypesoft
NEXT_PUBLIC_API_URL=http://api:8080
NEXT_PUBLIC_KEYCLOAK_URL=http://keycloak:8080
NEXT_PUBLIC_KEYCLOAK_REALM=hypesoft
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=hypesoft-frontend
```

4) Start (development profile)
```bash
docker compose --profile dev up -d mongodb keycloak api frontend
docker compose ps
```

5) Start (production profile via Nginx)
```bash
# Ensure dev services are healthy first
docker compose --profile dev up -d mongodb keycloak api frontend
# Then bring up the reverse proxy
docker compose --profile prod up -d nginx
```

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger: http://localhost:5000/swagger
- Mongo Express: http://localhost:8081
- Keycloak: http://localhost:8080
- Nginx (prod): http://localhost:80

## Health Checks
- API liveness: `GET http://localhost:5000/health/live`
- API readiness: `GET http://localhost:5000/health/ready`
- Nginx health (simple): `GET http://localhost/health`
- Keycloak readiness (internal): `http://keycloak:8080/health/ready`

## Authentication (Keycloak)
- Admin console: `http://localhost:8080`
- Admin credentials: `admin` / `admin123` (dev only)
- Realm imported automatically from `scripts/keycloak-realm.json`
- Frontend client configured with PKCE and allowed origins for `http://localhost:3000`

## Development (run parts locally)
Start only MongoDB in Docker and run apps locally to iterate faster:
```bash
# Start DB only
docker compose --profile dev up -d mongodb

# Backend (local)
cd backend/src/Hypesoft.API
ASPNETCORE_ENVIRONMENT=Development dotnet run

# Frontend (local)
cd frontend
npm install
npm run dev
```
- API base URL locally: `http://localhost:5000`
- Frontend uses `NEXT_PUBLIC_API_URL` (configure in `.env.local` if needed)

## Security & Performance
- CORS by environment (Dev: permissive, Prod: restricted via `Cors:AllowedOrigins`)
- Security headers (Prod): HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- Global rate limiting on API (fixed window 100 req/min/IP)
- API caching for dashboard queries (in-memory)
- MongoDB indexes on frequently queried fields (categories, products)

## Troubleshooting
1) Port already in use
```bash
# macOS/Linux
lsof -ti :5000 | xargs -r kill -9
```

2) CORS blocked in browser
- Ensure API is running in Development and CORS middleware is applied before authentication.
- Confirm frontend uses `NEXT_PUBLIC_API_URL` pointing to API (http://localhost:5000 when local).

3) Keycloak unhealthy (compose)
- First boot can take ~1 minute (DB init + realm import).
- Check logs: `docker compose logs --tail=200 keycloak`
- Healthcheck uses `/health/ready`; wait until it flips to healthy.

4) Slow Docker builds
- Dockerfiles use multi-stage builds and cache mounts (NuGet, npm, Next cache).
- Avoid bind-mounting source over built images in Compose (not used in this setup).

5) 401 Unauthorized from API
- Ensure requests include `Authorization: Bearer <token>` from Keycloak.
- Frontend automatically refreshes tokens via Keycloak JS adapter.

## Commit Convention
We follow Conventional Commits: https://www.conventionalcommits.org/
Examples:
```text
feat(products): add product CRUD and validation
fix(api): resolve CORS order and apply in Development
docs(readme): add docker compose usage and troubleshooting
refactor(frontend): replace anchors with Next Link to keep auth state
perf(docker): enable build cache mounts and trim images
```

## Notes
- This repository is designed to be evaluated locally with Docker Compose.
- Production-only features (like strict security headers) are activated under Production environment.

---
Hypesoft Challenge – Product Management System
