---
trigger: always_on
description: >-
  Strict architectural boundaries for the University-ERP modular monolith and multi-portal frontend. Enforces domain isolation, cross-module communication rules, and ADR compliance.
---

# Architecture Boundaries & Modular Monolith Isolation Rules

This document establishes the non-negotiable architectural boundaries across the University-ERP monorepo, informed by the system ADRs (`ADR-001` through `ADR-004`).

---

## 1. Monolith Domain Clusters & Bounded Contexts

The backend is partitioned into 5 autonomous domain clusters containing 22 bounded contexts:

```
src/Modules/
├── Academic/
│   ├── AcademicScheduling
│   ├── Assessments
│   ├── Curriculum
│   ├── Enrollment
│   ├── Examination
│   ├── LearningManagement
│   ├── Registrar
│   ├── StudentInformation
│   └── Teaching
├── Administration/
│   ├── AssetManagement
│   ├── Facilities
│   ├── Finance
│   ├── HumanResources
│   ├── Inventory
│   ├── Library
│   ├── MessCanteen
│   ├── Payroll
│   ├── Procurement
│   └── Transport
├── Governance/
│   ├── EventManagement
│   ├── GrievanceManagement
│   ├── Helpdesk
│   ├── QualityAccreditation
│   └── VisitorManagement
├── Platform/
│   ├── AnalyticsBI
│   ├── Communication
│   ├── CRM
│   ├── DocumentManagement
│   ├── IdentityAccess
│   ├── MultiCampus
│   └── Notification
└── StudentLifecycle/
    ├── Admissions
    ├── Alumni
    ├── GuidanceCounseling
    ├── HealthCenter
    ├── Hostel
    └── PlacementCareer
```

---

## 2. Invariant Cross-Module Communication Rules

### Rule 1: Zero Private Persistence Leaks (ADR-001)
- A module MUST NEVER reference another module's `DbContext`, repositories, entities, or database tables.
- Each module maintains its own isolated schema or tables in PostgreSQL managed via its own EF Core configurations.
- Direct SQL joins or foreign keys across module schemas are strictly forbidden.

### Rule 2: In-Process Contracts or Integration Events Only (ADR-004)
- **Synchronous Cross-Module Reads**: Permitted ONLY via interfaces defined in `UniversityErp.Contracts/PublicApiContracts/<Domain>/`.
  - Example: `Registrar.CurriculumApi.cs`, `Finance.BillingApi.cs`, `Facilities.SpaceAvailabilityApi.cs`.
- **Asynchronous Cross-Module Side-Effects**: Permitted ONLY via integration events defined in `UniversityErp.Contracts/IntegrationEvents/<Domain>/`.
  - Events must be published using the Transactional Outbox pattern implemented in `SharedKernel.Infrastructure`.
  - Consuming modules declare `IConsumer<TIntegrationEvent>` or MediatR event handlers in their `Application/` layer.

### Rule 3: Shared Kernel Scope Restriction (ADR-002)
- `SharedKernel` contains only domain-agnostic primitives:
  - Base classes: `Entity`, `AggregateRoot`, `ValueObject`, `IDomainEvent`, `Result`, `Result<T>`.
  - Outbox, inbox, tracing, and logging abstractions.
- Never place business logic, domain entities, or domain-specific enums into `SharedKernel`.

---

## 3. Frontend Portal Isolation & Communication

The frontend comprises 14 role-dedicated web portals (`apps/`) and 1 offline desktop client (`clients/lms-offline-avalonia`):

### Rule 4: No Direct HTTP Calls
- Portals MUST NEVER make raw `fetch()` or raw `axios.get()` requests directly to API endpoints.
- All HTTP interactions must flow through the typed functions in `@university-erp/api-clients`.

### Rule 5: Authentication & Session Boundaries
- Portals MUST consume identity and permissions exclusively via `@university-erp/auth-sdk` (`useAuth()` hook or route guards like `RegistrarGuard`, `FacultyGuard`).
- Portals MUST NOT attempt to decode JWT tokens manually or inspect raw localStorage authentication tokens.

### Rule 6: Shared Library Contract Hoisting
- Reusable logic belongs in `University-ERP-Frontend/libs/`:
  - UI Design System: `@university-erp/ui-kit`
  - Shell & Routing Guards: `@university-erp/shell-kit`
  - Logging & Telemetry: `@university-erp/core-logger`
  - View Models: `@university-erp/domain-viewmodels`
  - Offline Sync: `@university-erp/offline-sync`
  - Workflows: `@university-erp/workflow-sdk`
- Never duplicate shared components across different `apps/*` directories.

