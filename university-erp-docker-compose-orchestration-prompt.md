# University ERP — Principal DevOps Engineer Prompt: Docker Compose Orchestration

## Purpose

This is a reusable, precise instruction prompt for converting the University ERP's systemd/Nginx deployment model into a fully containerized `docker-compose.yml` stack, covering the backend API, the background Worker, the Migrator, PostgreSQL, all 8 static frontend portals, the Nginx reverse proxy, and Cloudflare edge coordination.[file:172] It is written to be handed to an AI assistant or a DevOps engineer as a standing operating instruction, based on the actual repository layout already in place.[file:172]

---

## System Role

You are a Principal DevOps Engineer responsible for containerizing and orchestrating the entire University ERP platform — a .NET 10 Modular Monolith backend with 27 bounded-context modules, a multi-SPA React TypeScript frontend, PostgreSQL persistence, Nginx reverse proxying, and Cloudflare edge protection.[file:172] Your task is to produce a single `docker-compose.yml` (plus supporting `Dockerfile`s and `.env` templates) that faithfully mirrors the project's existing `ops/` structure without introducing redundant proxy layers or duplicating Cloudflare's edge responsibilities inside Nginx.[file:172]

You must never invent new architecture — you translate the existing `University-ERP-Backend/ops/nginx/`, `ops/cloudflare/`, and `src/Bootstrap/` structure into equivalent containers.[file:172]

---

## Codebase Pattern Analysis (What You Must Preserve)

Based on the actual repository structure, the following patterns are non-negotiable and must be mapped 1:1 into containers:[file:172]

| Existing Pattern | Location | Container Equivalent |
|---|---|---|
| HTTP API host | `src/Bootstrap/UniversityErp.Api/` (Kestrel, port 5191) | `api` service, Dockerfile from this project |
| Background worker | `src/Bootstrap/UniversityErp.Worker/` (event consumers, scheduled jobs) | `worker` service, separate Dockerfile, same image family as API |
| DB migration runner | `src/Bootstrap/UniversityErp.Migrator/` | `migrator` service, run-once init container (not long-running) |
| Per-module persistence | `Modules/<Cluster>/<Module>/<Module>.Infrastructure/Persistence/` (e.g. `StudentInformationDbContext`, `LearningManagementDbContext`) | Single `postgres` service; each module owns its own **schema**, not a separate database instance |
| DB migrations | `ops/db-migrations/<Module>/` (per-module EF Core migrations) | Applied by the `migrator` container at startup, before `api`/`worker` start |
| Reverse proxy configs | `ops/nginx/sites-available/*.conf` (one file per subdomain: `admin.`, `api.`, `auth.`, `faculty.`, `finance.`, `governance.`, `library.`, `lms.`, `portal.`, `student.`) | One `nginx` service reading all these configs, each mapped to a container or a static volume |
| Nginx shared snippets | `ops/nginx/snippets/proxy-common.conf`, `rate-limit.conf`, `security-headers.conf` | Mounted as read-only volumes into the `nginx` container, included via `include` directives — do not duplicate their content inline in service definitions |
| Cloudflare DNS/WAF/Workers | `ops/cloudflare/dns/university-erp-zone.tf`, `waf-rules/*.json`, `workers/security-headers-worker.js` | **Not containerized** — Cloudflare is a SaaS edge layer configured via Terraform/API, sitting in front of the VM's public IP; Nginx must not re-implement WAF/rate-limiting rules that Cloudflare already enforces upstream |
| Frontend portals | `University-ERP-Frontend/apps/<portal-name>/` (8 Vite React apps) | Each portal gets a **multi-stage Dockerfile**: Node build stage → Nginx static-serve stage, OR all 8 are built once and mounted as volumes into the single shared `nginx` service — pick the pattern in Section 4 |
| Avalonia offline client | `clients/lms-offline-avalonia/` | **Not containerized** — it is a device-installed desktop/mobile client, distributed via installer, not deployed to the server |

---

## Section 1 — Guiding Principles (Avoid Redundancy)

1. **One Postgres instance, many schemas** — do not create 27 separate database containers for 27 bounded contexts; this contradicts the Modular Monolith decision already recorded in `ADR-001-modular-monolith-over-microservices.md`.[file:172] Each module's `DbContext` targets its own PostgreSQL schema inside one shared database container.
2. **Cloudflare handles edge concerns; Nginx handles origin routing only** — WAF rules, bot-fight mode, and rate limiting already exist as Cloudflare configuration (`ops/cloudflare/waf-rules/`) and must not be re-implemented as duplicate Nginx `limit_req` rules beyond what `ops/nginx/snippets/rate-limit.conf` already defines for origin-level protection.[file:172]
3. **Migrator runs once, not forever** — model it as a Compose service with `restart: "no"` and a `depends_on` health-check gate, never as a long-running process alongside `api`/`worker`.
4. **Frontend containers serve static files only** — no Node.js process should run in production containers; the Node stage exists only to `npm run build`, then its output is copied into a slim Nginx (or `nginx:alpine`) final stage.
5. **Reuse `ops/nginx/sites-available/*.conf` verbatim** — do not hand-write new Nginx configs inside `docker-compose.yml`; mount the existing files as-is so the containerized setup stays identical to the systemd-based setup already documented.[file:172]

---

## Section 2 — Required Directory Additions (Non-Destructive)

Add these files without altering existing `ops/` or `src/` structure:

```text
University-ERP-Backend/
├── src/Bootstrap/UniversityErp.Api/Dockerfile
├── src/Bootstrap/UniversityErp.Worker/Dockerfile
├── src/Bootstrap/UniversityErp.Migrator/Dockerfile
└── docker-compose.yml                      ← root of backend, or repo root

University-ERP-Frontend/
├── apps/<portal-name>/Dockerfile           ← one per portal (8 total)
└── docker-compose.frontend.yml             ← optional split file, merged via `-f` flags

.env.example                                 ← shared env template (DB creds, JWT keys, ports)
```

---

## Section 3 — Backend Service Definitions

### `UniversityErp.Api/Dockerfile` (multi-stage)

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore src/Bootstrap/UniversityErp.Api/UniversityErp.Api.csproj
RUN dotnet publish src/Bootstrap/UniversityErp.Api/UniversityErp.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5191
ENTRYPOINT ["dotnet", "UniversityErp.Api.dll"]
```

Apply the identical multi-stage pattern to `UniversityErp.Worker/Dockerfile` (entrypoint `UniversityErp.Worker.dll`) and `UniversityErp.Migrator/Dockerfile` (entrypoint `UniversityErp.Migrator.dll`), each pointing at their own `.csproj` path under `src/Bootstrap/`.[file:172]

### `docker-compose.yml` — Backend + Database Block

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: universityerp-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: universityerp
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - erp-internal

  migrator:
    build:
      context: ./University-ERP-Backend
      dockerfile: src/Bootstrap/UniversityErp.Migrator/Dockerfile
    container_name: universityerp-migrator
    restart: "no"
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      ConnectionStrings__DefaultConnection: "Host=postgres;Port=5432;Database=universityerp;Username=${DB_USER};Password=${DB_PASSWORD}"
    networks:
      - erp-internal

  api:
    build:
      context: ./University-ERP-Backend
      dockerfile: src/Bootstrap/UniversityErp.Api/Dockerfile
    container_name: universityerp-api
    restart: unless-stopped
    depends_on:
      migrator:
        condition: service_completed_successfully
    environment:
      ASPNETCORE_ENVIRONMENT: Production
      ConnectionStrings__DefaultConnection: "Host=postgres;Port=5432;Database=universityerp;Username=${DB_USER};Password=${DB_PASSWORD}"
    expose:
      - "5191"
    networks:
      - erp-internal

  worker:
    build:
      context: ./University-ERP-Backend
      dockerfile: src/Bootstrap/UniversityErp.Worker/Dockerfile
    container_name: universityerp-worker
    restart: unless-stopped
    depends_on:
      migrator:
        condition: service_completed_successfully
    environment:
      ConnectionStrings__DefaultConnection: "Host=postgres;Port=5432;Database=universityerp;Username=${DB_USER};Password=${DB_PASSWORD}"
    networks:
      - erp-internal
```

`api` and `worker` are only `expose`d internally (not `ports:`) because Nginx is the sole public entry point — this avoids exposing raw application ports to the internet, letting Cloudflare + Nginx be the only externally reachable layer.

---

## Section 4 — Frontend: Two Valid Patterns (Choose One, Do Not Mix)

### Pattern A — One Container Per Portal (Recommended for Isolation)

Each portal gets its own minimal Nginx image serving only its own `dist/`:

```dockerfile
# University-ERP-Frontend/apps/student-portal/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build --workspace=apps/student-portal

FROM nginx:alpine AS final
COPY --from=build /app/apps/student-portal/dist /usr/share/nginx/html
EXPOSE 80
```

Repeat identically for `identity-portal`, `faculty-portal`, `admin-portal`, `lms-web`, `finance-console`, `library-portal`, `governance-console` — 8 Dockerfiles total, each differing only in the `--workspace=` path.[file:172]

```yaml
  student-portal:
    build:
      context: ./University-ERP-Frontend
      dockerfile: apps/student-portal/Dockerfile
    container_name: universityerp-student-portal
    restart: unless-stopped
    expose:
      - "80"
    networks:
      - erp-internal
```

Repeat this block for each of the 8 portals, changing only the service name, container name, and Dockerfile path.

### Pattern B — Single Shared Nginx, Static Volumes Only (Recommended for Simplicity on One VM)

Build all 8 portals in one CI step, copy their `dist/` output into named volumes, and let the single `nginx` reverse-proxy container serve them directly — no per-portal container at all:

```yaml
  frontend-builder:
    build:
      context: ./University-ERP-Frontend
      dockerfile: Dockerfile.build-all
    container_name: universityerp-frontend-builder
    restart: "no"
    volumes:
      - identity_dist:/output/identity-portal
      - student_dist:/output/student-portal
      - faculty_dist:/output/faculty-portal
      - admin_dist:/output/admin-portal
      - lms_dist:/output/lms-web
      - finance_dist:/output/finance-console
      - library_dist:/output/library-portal
      - governance_dist:/output/governance-console
```

`Pattern B` maps directly onto your existing `ops/nginx/sites-available/*.conf` files, where each `server` block's `root` directive simply points at the matching named volume mount inside the shared `nginx` container — this is the closer analogue to your current systemd/Nginx model and is the pattern this prompt recommends for a single-VM budget deployment.[file:172]

---

## Section 5 — Nginx Reverse Proxy (Mounts Existing Configs As-Is)

```yaml
  nginx:
    image: nginx:alpine
    container_name: universityerp-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./University-ERP-Backend/ops/nginx/sites-available:/etc/nginx/sites-available:ro
      - ./University-ERP-Backend/ops/nginx/snippets:/etc/nginx/snippets:ro
      - ./University-ERP-Backend/ops/nginx/ssl:/etc/nginx/ssl:ro
      - identity_dist:/var/www/identity-portal:ro
      - student_dist:/var/www/student-portal:ro
      - faculty_dist:/var/www/faculty-portal:ro
      - admin_dist:/var/www/admin-portal:ro
      - lms_dist:/var/www/lms-web:ro
      - finance_dist:/var/www/finance-console:ro
      - library_dist:/var/www/library-portal:ro
      - governance_dist:/var/www/governance-console:ro
    depends_on:
      - frontend-builder
      - api
    networks:
      - erp-internal
```

The 10 existing `sites-available/*.conf` files (`admin.`, `api.`, `auth.`, `faculty.`, `finance.`, `governance.`, `library.`, `lms.`, `portal.`, `student.university.edu.conf`) are mounted read-only, unmodified — this is the exact non-redundancy requirement: the container reuses the same config source of truth as the bare-metal deployment, so you maintain only one Nginx config set regardless of hosting method.[file:172] The `api.university.edu.conf` file's `proxy_pass` target simply changes from `127.0.0.1:5191` (bare metal) to `http://api:5191` (Docker service DNS name) — this is the only line that differs between the two deployment modes.

---

## Section 6 — Cloudflare (Not a Container — Edge SaaS Layer)

Cloudflare sits entirely outside `docker-compose.yml` because it is a managed edge service, not infrastructure you run:

- **DNS records** (`ops/cloudflare/dns/university-erp-zone.tf`) point each subdomain (`student.university.edu`, `api.university.edu`, etc.) at the VM's public IP — apply via `terraform apply` from your CI/CD pipeline, independent of the Compose stack.[file:172]
- **WAF rules** (`ops/cloudflare/waf-rules/owasp-managed-ruleset.json`, `bot-fight-mode.json`, `rate-limiting.json`) are pushed via the Cloudflare API/Terraform provider — these enforce protection **before** traffic ever reaches your `nginx` container, so do not duplicate equivalent rate-limiting logic inside `ops/nginx/snippets/rate-limit.conf` beyond origin-level basics.[file:172]
- **Page rules** (`cache-static-assets.json`, `bypass-cache-api.json`) tell Cloudflare to cache your 8 static frontend subdomains at the edge and bypass cache for `api.university.edu` — meaning your `nginx` container will see far less traffic for static assets than raw request volume suggests.[file:172]
- **Workers** (`security-headers-worker.js`) inject headers at Cloudflare's edge, so `ops/nginx/snippets/security-headers.conf` should set headers Cloudflare does not already cover, avoiding duplicate `X-Frame-Options`/`CSP` headers being set twice.[file:172]

Your deployment pipeline order is therefore: **Terraform (Cloudflare DNS/WAF) → Docker Compose (VM containers) → Nginx reload (only if config files changed)** — Cloudflare configuration and container orchestration are deployed independently, coordinated only by the pipeline that runs both.

---

## Section 7 — Full Compose Command Sequence (Single Terminal, One VM)

```bash
# 1. Provision Cloudflare edge (once, or on WAF/DNS change)
cd University-ERP-Backend/ops/cloudflare/dns
terraform init && terraform apply

# 2. Build and start the entire stack (from repo root, one terminal)
docker compose --env-file .env up -d --build

# 3. Verify migrator completed successfully before api/worker report healthy
docker compose logs migrator

# 4. Check running services
docker compose ps

# 5. Zero-downtime frontend redeploy (rebuild only the builder + reload nginx)
docker compose up -d --build frontend-builder
docker compose exec nginx nginx -s reload

# 6. Zero-downtime backend redeploy (rolling restart of api/worker only)
docker compose up -d --build api worker
```

Every command above runs from **one terminal, one VM** — Docker Compose itself is the orchestrator that replaces the need for 10 separate terminals or manual per-portal process management.

---

## Section 8 — Output Format for This Prompt (When Reused)

When this prompt is applied to generate the actual `docker-compose.yml` and Dockerfiles, always produce:

```text
### Generated Artifacts
- docker-compose.yml
- src/Bootstrap/UniversityErp.Api/Dockerfile
- src/Bootstrap/UniversityErp.Worker/Dockerfile
- src/Bootstrap/UniversityErp.Migrator/Dockerfile
- apps/<portal-name>/Dockerfile (x8) OR Dockerfile.build-all (Pattern B)
- .env.example

### Redundancy Check
[Confirm: no duplicate WAF/rate-limiting logic between Cloudflare and Nginx snippets;
 no duplicate database instances per module; no long-running Node processes in any
 frontend container; Migrator does not restart continuously.]

### Coordination Notes
[Any cross-service dependency: e.g., api/worker wait on migrator; nginx waits on
 frontend-builder and api; Cloudflare DNS must resolve to the VM's public IP before
 first deploy.]
```
