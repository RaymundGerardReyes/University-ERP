---
name: port-and-env-manager
description: >-
  Audits, validates, and manages port assignments across all 14 frontend portals, backend host services, and Docker infrastructure in University-ERP to prevent collisions.
---

# Port and Environment Manager Skill

This skill provides procedures and tooling to validate port allocations, run collision audits, and configure local development environments across the University-ERP monorepo.

---

## 1. Canonical Host Port Registry

As documented in `PORT_REGISTRY.md` and `docker-compose.yml`:

| Port | Service / Portal | Protocol | Host Binding | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **8081** | `nginx` | TCP | `0.0.0.0` | Reverse proxy edge entry point |
| **5000 / 5001** | `UniversityErp.Api` | HTTP/HTTPS | `localhost` | ASP.NET Core 9 backend host |
| **5432** | `postgres` (internal bridge) | TCP | `erp-internal` | Primary PostgreSQL database |
| **6379** | `redis` | TCP | `127.0.0.1` | Distributed caching & session store |
| **5672 / 15672**| `rabbitmq` | TCP | `127.0.0.1` | AMQP broker & Management UI |
| **8025 / 1025** | `mailpit` | TCP | `127.0.0.1` | Local SMTP capture server & Web UI |
| **12345** | `alloy` | TCP | `127.0.0.1` | Grafana Alloy telemetry agent |
| **3100** | `loki` | TCP | `127.0.0.1` | Structured log storage |

### Frontend Portal Dev Ports (Vite Dev Server)
| Port | Portal | Domain Focus |
| :--- | :--- | :--- |
| **5173** | `applicant-portal` | Public applicant admissions intake |
| **5174** | `student-portal` | Enrolled student self-service & registration |
| **5175** | `faculty-portal` | Instructor grading & section advising |
| **5176** | `registrar-portal` | Curriculum catalog & clearance processing |
| **5177** | `admissions-portal` | Staff application review & scoring |
| **5178** | `finance-console` | Tuition assessment & cashiering |
| **5179** | `admin-portal` | System & organizational administration |
| **5180** | `lms-web` | Web learning management system |
| **5181** | `library-portal` | Library catalog & circulation |
| **5182** | `identity-portal` | Identity & access management |
| **5183** | `governance-console`| Compliance & accreditation |
| **5184** | `platform-console` | Database & tenant operations |
| **3006** | `payment-gateway` | Hosted checkout runtime |

---

## 2. Port Collision Validation Tools

Before launching local containers or portals, run the port collision checker:

### Run Automated Port Validator
```powershell
# Using Node validator (checks docker compose and active OS ports)
node scripts/port_validator.js university-erp

# Using PowerShell script
powershell -ExecutionPolicy Bypass -File scripts/check_port_collisions.ps1
```

### Check Active Listening Ports in Windows
```powershell
# Check if port 5173 is already in use
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object LocalAddress, LocalPort, State, OwningProcess

# Check all listening ports in the 5170-5190 range
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -ge 5170 -and $_.LocalPort -le 5190 } | Select-Object LocalPort, OwningProcess
```

---

## 3. Docker Infrastructure Lifecycle

```powershell
# Start essential backing infrastructure (Postgres, Redis, RabbitMQ)
docker compose up -d postgres redis rabbitmq

# Run database migrations
docker compose run --rm migrator

# View running container health
docker compose ps
```

