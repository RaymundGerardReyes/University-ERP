# University-ERP Root Architecture & AI Agent Rules

Welcome to the **University ERP Monorepo** (`University-ERP`). This file serves as the canonical `@rules` document for Google Antigravity, Gemini, and AI coding assistants operating on this repository.

---

## 1. Monorepo Structure & Domain Boundaries

The repository is divided into two primary sub-systems and shared orchestration tooling:

```
University-ERP/
├── University-ERP-Backend/        # .NET 10 Modular Monolith (C#, Clean Architecture, DDD)
│   ├── src/
│   │   ├── Bootstrap/             # Host API (UniversityErp.Api) & Migrator
│   │   ├── Modules/               # Isolated domain modules (Academic, Administration, etc.)
│   │   ├── Contracts/             # Cross-module communication DTOs & interfaces
│   │   └── SharedKernel/          # Shared domain primitives & base classes
├── University-ERP-Frontend/       # React 19 + TypeScript Monorepo (Vite, DBMA)
│   ├── apps/                      # 14 Role-Dedicated Domain Portals & Consoles
│   ├── libs/                      # 9 Shared Core Libraries (ui-kit, shell-kit, auth-sdk, etc.)
│   └── tests/                     # Canonical Centralized Multi-Tier Test Suite
├── docker-compose.yml             # Local orchestration with Postgres, Redis, RabbitMQ
├── isolated_release.sh            # Git semantic versioning release engine
└── GEMINI.md                      # This root rules and guidelines file
```

### Critical Architectural Boundaries
1. **Frontend-Backend Contract Isolation**:
   - Frontend portals MUST never make raw, un-typed HTTP requests directly to backend services.
   - All HTTP interactions must flow through `@university-erp/api-clients` or designated `<Feature>.api.ts` services.
2. **Modular Monolith Integrity**:
   - Backend modules (`Academic`, `Administration`, `Governance`, `Platform`, `StudentLifecycle`) MUST NOT reference each other's persistence contexts or private domain entities.
   - Cross-module communication is permitted ONLY via in-process MediatR contracts or integration events.
3. **Workspace Dependency Hoisting**:
   - In `University-ERP-Frontend`, all shared dependencies (`react`, `react-dom`, `@tanstack/react-query`, `vitest`) MUST be hoisted to the root `node_modules/`.
   - Never create nested `node_modules` inside `apps/*` or `libs/*`.

---

## 2. Frontend Development Standards (DBMA)

### A. Vertical Slice Feature Anatomy
Every application under `University-ERP-Frontend/apps/<portal-name>/src/features/<FeatureName>/` must strictly adhere to the following convention:
- `<FeatureName>.page.tsx`: Top-level view controller and route entry point.
- `<FeatureName>.api.ts`: API service calls using `@university-erp/api-clients`.
- `<FeatureName>.hooks.ts`: React Query hooks (`useQuery`, `useMutation`).
- `<FeatureName>.types.ts`: TypeScript view models, DTOs, and component props.
- `components/`: Granular presentational components dedicated solely to this feature.

### B. Shared Library Usage
- **UI Kit**: Always use primitives from `@university-erp/ui-kit` (`Button`, `Card`, `Modal`, `Table`, `Badge`, `PageHeader`, `Input`) rather than building raw unstyled HTML elements.
- **Shell Kit**: Wrap portal routing with `@university-erp/shell-kit` (`AppShell`, `AuthGuard`).
- **Auth SDK**: Consume user identity, session state, and permissions via `useAuth()` from `@university-erp/auth-sdk`.

### C. Frontend Testing Rules
- All new unit tests belong in canonical `University-ERP-Frontend/tests/Unit/<portal-name>/<FeatureName>.unit.test.tsx`.
- Component tests must render within `<QueryClientProvider>` and `<MemoryRouter>`.
- Unit tests must mock `@university-erp/auth-sdk` and `@university-erp/api-clients` to guarantee isolated execution.
- **Syntax Safety**: When writing test descriptions and `it.todo(...)` statements, ALWAYS use double quotes or escape apostrophes to avoid breaking JavaScript string termination:
  - ✅ `it.todo("Verify applicant's profile...");`
  - ❌ `it.todo('Verify applicant's profile...');`

---

## 3. Backend Development Standards (.NET Modular Monolith)

### A. Clean Architecture Layers per Module
Each module under `University-ERP-Backend/src/Modules/<Domain>/<Module>/` follows Clean Architecture:
- `Domain/`: Entities, Value Objects, Domain Events, Enums, Aggregate Roots, Domain Exceptions.
- `Application/`: MediatR Commands, Queries, Handlers, FluentValidation Validators, DTOs.
- `Infrastructure/`: Entity Framework Core `DbContext`, Configurations, Repositories, External Services.
- `Endpoints/` (or `Api/`): Minimal API route definitions mapped to MediatR dispatchers.
- `Tests/`: Unit tests and Integration tests with isolated database fixtures.

### B. CQRS & MediatR Pattern
- Write side-effects as **Commands** (`IRequest<Result<TResponse>>`) handled by dedicated Command Handlers.
- Write read operations as **Queries** (`IRequest<Result<TDto>>`) handled by optimized read-only Queries.
- Use explicit domain transaction boundaries; do not mix query logic with state-mutating commands.

---

## 4. Git, Commit & Release Rules

1. **Conventional Commits**:
   All commit messages must follow the format:
   `<type>(<scope>): <short description>`
   - Types: `feat`, `fix`, `test`, `refactor`, `chore`, `docs`, `perf`, `ci`.
   - Scopes: `frontend`, `backend`, `<portal-name>`, `<module-name>`.
2. **Release Engine**:
   - Production releases are orchestrated using `isolated_release.sh`.
   - Never manually push raw unvetted Git tags.

---

## 5. Quick Command Cheatsheet

| Task | Command | Directory |
| :--- | :--- | :--- |
| **Run All Frontend Unit Tests** | `npx vitest run tests/Unit` | `University-ERP-Frontend` |
| **Target Single Portal Tests** | `npx vitest run tests/Unit/<portal>` | `University-ERP-Frontend` |
| **Start Frontend Portals** | `npm run dev:all` | `University-ERP-Frontend` |
| **Build Frontend Workspaces** | `npm run build --workspaces` | `University-ERP-Frontend` |
| **Run Backend API** | `dotnet run --project .../UniversityErp.Api.csproj` | `University-ERP-Backend` |
| **Run Backend Tests** | `dotnet test UniversityErp.slnx` | Repository Root |
| **Run Backend Architecture Tests**| `dotnet test .../UniversityErp.ArchitectureTests.csproj` | `University-ERP-Backend` |
| **Check Port Collisions** | `node scripts/port_validator.js university-erp` | Repository Root |
| **Start Docker Infrastructure** | `docker compose up -d` | Repository Root |

---

## 6. Antigravity Agent Rules & Skills Inventory (`.agents/`)

### Registered Rules (`.agents/rules/`)
- `architecture-boundaries.md` (`always_on`): Enforces modular monolith domain isolation, ADR compliance, and forbidden cross-module references.
- `frontend-dbma.md` (`glob: University-ERP-Frontend/**`): 14 portals, 9 shared libraries, vertical slices, TanStack Query cache rules.
- `backend-clean-architecture.md` (`glob: University-ERP-Backend/**`): 5 domain clusters, 22 bounded contexts, CQRS, MediatR, and Aggregate invariants.
- `unit-testing.md` (`glob: University-ERP-Frontend/tests/**`): Vitest mocking templates, auth SDK mock, string escaping, and DOM assertion safety.
- `git-versioning.md` (`always_on`): Conventional commit scopes matching exact domains and portals, plus `isolated_release.sh` versioning rules.

### Registered Skills (`.agents/skills/`)
- `frontend-unit-tester`: Executes, filters, and diagnoses Vitest tests across all 14 portals and 9 shared libraries with automated error resolution.
- `portal-feature-scaffolder`: Scaffolds full DBMA vertical slices (`.page.tsx`, `.api.ts`, `.hooks.ts`, `.types.ts`) and companion unit tests.
- `backend-test-runner`: Runs and filters .NET 10 tests across all 22 module test suites, architecture tests, and multi-module E2E flows.
- `backend-cqrs-scaffolder`: Generates CQRS Command/Query, Handler, FluentValidator, Minimal API endpoint, and unit tests for any module.
- `cross-module-event-tracer`: Catalogs, traces, and scaffolds cross-module asynchronous integration events between domains via Outbox.
- `port-and-env-manager`: Audits and validates port allocations against `PORT_REGISTRY.md`, runs port collision checks, and configures dev environments.


