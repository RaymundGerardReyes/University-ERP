# University ERP — Frontend Domain-Based Modular Architecture (DBMA)

## Purpose and Traceability

This document defines the frontend architecture for the University ERP platform, applying the same Domain-Driven Design (DDD) and Domain-Based Modular Architecture (DBMA) discipline already used for the backend.[file:78][file:98] It covers two frontend clients required by the business: **subdomain-based web portals** (React TypeScript, per bounded-context cluster) and the **hybrid online/offline LMS client** (Avalonia UI, .NET), unified under a single central Identity Provider and fronted by Cloudflare + Nginx.[file:78][file:98]

Nothing here duplicates backend business logic. The frontend consumes only `PublicApiContracts` and `IntegrationEvents` already defined in `src/Contracts/`; all authorization decisions remain backend-enforced, per Zero Trust principles already adopted for this platform.[file:98][file:115]

## Governing Principle (Carried Over from Backend DBMA)

> Modules define the boundaries of the system. Vertical slices organize the code within those boundaries.

The frontend applies this at three levels:

1. **App level** — one deployable frontend app per subdomain/bounded-context cluster (student, faculty, admin, lms, finance, etc.), mirroring `src/Modules/<Cluster>/` on the backend.[file:98]
2. **Feature level** — inside each app, features are vertical slices (one folder per use case: view + state + API call), not horizontal technical layers duplicated per feature.
3. **Shared level** — cross-cutting concerns (design system, auth SDK, typed API clients, offline sync engine) live in shared libraries, mirroring the backend's `SharedKernel/` — deliberately small, deliberately boring, never containing business aggregates.[file:98]

## Frontend Domain Cluster Map (Mirrors Backend Exactly)

| Cluster | Backend Modules (already built) | Frontend App(s) | Subdomain |
|---|---|---|---|
| Academic | StudentInformation, Registrar, Examination, LearningManagement, AcademicScheduling | `lms-web`, `lms-offline-avalonia`, `faculty-portal` | `lms.university.edu`, `faculty.university.edu` |
| StudentLifecycle | Admissions, Hostel, HealthCenter, GuidanceCounseling, PlacementCareer, Alumni | `student-portal` | `student.university.edu` |
| Administration | Finance, HumanResources, Payroll, Procurement, Inventory, AssetManagement, Library, Transport, MessCanteen, Facilities | `admin-portal`, `finance-console`, `library-portal` | `admin.university.edu`, `finance.university.edu`, `library.university.edu` |
| Governance | GrievanceManagement, Helpdesk, EventManagement, VisitorManagement, QualityAccreditation | `governance-console` | `governance.university.edu` |
| Platform | IdentityAccess, Notification, Communication, DocumentManagement, AnalyticsBI, CRM, MultiCampus | `identity-portal` (auth gateway UI), shared `auth-sdk`, `notification-widget` | `auth.university.edu`, `portal.university.edu` |

This table exists so that a business change request phrased as "update the hostel allocation screen" maps to exactly one frontend app and one backend module, with zero ambiguity, exactly matching the backend's DBMA payoff.[file:98]

## Full Frontend Repository Tree

```text
university-erp-frontend/
│
├── domain/
│   ├── model/                      # symlinked/synced copies of backend domain/model
│   ├── adr/
│   └── runbooks/
│
├── apps/
│   ├── identity-portal/            # React TS - auth.university.edu gateway UI
│   ├── student-portal/             # React TS - student.university.edu
│   ├── faculty-portal/             # React TS - faculty.university.edu
│   ├── admin-portal/               # React TS - admin.university.edu
│   ├── lms-web/                    # React TS PWA - lms.university.edu (online + light offline)
│   ├── finance-console/            # React TS - finance.university.edu
│   ├── library-portal/             # React TS - library.university.edu
│   └── governance-console/         # React TS - governance.university.edu
│
├── clients/
│   └── lms-offline-avalonia/       # Avalonia UI .NET - desktop/mobile offline LMS
│       ├── LmsOffline.Domain/
│       ├── LmsOffline.Application/
│       ├── LmsOffline.Infrastructure/
│       ├── LmsOffline.Presentation/
│       ├── LmsOffline.Contracts/
│       └── LmsOffline.Tests/
│
├── libs/
│   ├── ui-kit/                     # Shared design system (React)
│   ├── auth-sdk/                   # OIDC/OAuth2 client (React + .NET variant)
│   ├── api-clients/                # Typed clients generated from backend PublicApiContracts
│   │   ├── academic/
│   │   ├── student-lifecycle/
│   │   ├── administration/
│   │   ├── governance/
│   │   └── platform/
│   ├── domain-viewmodels/          # Read-only projections per bounded context
│   └── offline-sync/               # Shared offline sync + conflict resolution logic
│
├── tests/
│   ├── ArchitectureTests/          # Enforces app/lib boundary rules (dependency-cruiser)
│   ├── ComponentTests/
│   ├── E2ETests/
│   ├── AccessibilityTests/
│   ├── PerformanceTests/
│   └── SecurityTests/
│
└── ops/
    ├── cloudflare/
    ├── nginx/
    └── pipelines/
```

## 1. `domain/` — Same Business Knowledge, Shared with Backend

```text
domain/
├── model/        # read-only sync of backend domain/model/*.md
├── adr/          # frontend-specific ADRs (e.g., ADR-F01-avalonia-for-offline-lms.md)
└── runbooks/     # frontend incident runbooks (e.g., cdn-cache-poisoning.md)
```

The frontend never re-derives the Ubiquitous Language or Bounded Context Catalog; it references the backend's `domain/model/` as the single source of truth, syncing copies for frontend-team convenience, which prevents the well-known failure mode of frontend and backend teams inventing incompatible vocabularies for the same business concepts.[file:78][file:98]

## 2. `apps/` — One App per Bounded-Context Cluster (React TypeScript)

Each `apps/<name>` follows an identical internal skeleton, applying vertical-slice organization within Clean Architecture-inspired frontend layers:

```text
apps/<app-name>/
├── src/
│   ├── features/                   # vertical slices, one folder per use case
│   │   └── <UseCaseName>/
│   │       ├── <UseCaseName>.page.tsx
│   │       ├── <UseCaseName>.hooks.ts
│   │       ├── <UseCaseName>.api.ts
│   │       ├── <UseCaseName>.types.ts
│   │       └── <UseCaseName>.test.tsx
│   ├── shell/
│   │   ├── AppShell.tsx
│   │   ├── Routing.tsx
│   │   └── AuthGuard.tsx
│   ├── state/
│   │   └── queryClient.ts          # server-state cache (e.g., React Query)
│   ├── config/
│   │   ├── env.ts
│   │   └── authConfig.ts           # points to auth.university.edu only
│   └── main.tsx
├── public/
│   ├── manifest.webmanifest        # PWA manifest (lms-web, others optional)
│   └── service-worker.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

This exists because each portal is a **composition layer**, not an owner of business rules — features call typed API clients from `libs/api-clients/`, never re-implement Finance or Hostel logic locally, which is the frontend equivalent of the backend's Rule 1 ("Portals do not own core business rules").[file:98][file:115]

### `lms-web` specifics (React TS PWA)

`lms-web` additionally implements:

```text
apps/lms-web/src/
├── offline/
│   ├── indexedDbSchema.ts          # module outlines, draft submissions
│   ├── syncQueue.ts                # queued actions while offline
│   └── serviceWorkerRegistration.ts
└── features/
    ├── ModuleTimeline/              # shows instructor-defined start/availability windows
    ├── QuizWindowGuard/             # blocks quiz start outside allowed bracket
    └── AssignmentDraftEditor/       # offline-capable draft, synced on reconnect
```

`lms-web` covers **light offline** (cached reading, draft answers, timeline viewing) for browser-based access; it explicitly defers heavy offline exam-taking to `lms-offline-avalonia`, avoiding duplicate offline-engine implementations across two clients.

## 3. `clients/lms-offline-avalonia/` — Hybrid Online/Offline LMS (Heavy Offline)

This is the primary answer to the hybrid LMS requirement: instructor-defined module timelines, quiz/exam windows, and assignments must be usable **fully offline**, with immutable local scheduling and encrypted storage.[file:78]

```text
clients/lms-offline-avalonia/
├── LmsOffline.Domain/
│   ├── Aggregates/
│   │   ├── OfflineModule.cs
│   │   ├── OfflineAssessment.cs        # Quiz or Exam
│   │   └── OfflineAssignment.cs
│   ├── ValueObjects/
│   │   ├── AvailabilityWindow.cs       # immutable start/end, signed by server
│   │   ├── AttemptToken.cs
│   │   └── SyncStatus.cs
│   ├── Policies/
│   │   └── WindowEnforcementPolicy.cs  # blocks access outside AvailabilityWindow
│   └── Exceptions/
│       └── AssessmentWindowClosedException.cs
│
├── LmsOffline.Application/
│   ├── Features/
│   │   ├── DownloadModulePackage/
│   │   ├── StartOfflineAssessment/
│   │   ├── SubmitOfflineAssignment/
│   │   └── SyncPendingSubmissions/
│   └── ModuleRegistration.cs
│
├── LmsOffline.Infrastructure/
│   ├── Persistence/
│   │   ├── EncryptedSqliteContext.cs   # SQLite + SQLCipher
│   │   └── Migrations/
│   ├── Sync/
│   │   ├── OutboxSyncProcessor.cs      # queued offline actions -> server
│   │   └── ScheduleTokenVerifier.cs    # verifies signed availability windows
│   └── Auth/
│       └── OfflineTokenCache.cs        # bounded offline session allowance
│
├── LmsOffline.Presentation/
│   ├── Views/
│   │   ├── ModuleTimelineView.axaml
│   │   ├── AssessmentView.axaml
│   │   └── AssignmentSubmissionView.axaml
│   └── ViewModels/
│
├── LmsOffline.Contracts/
│   └── IntegrationEvents/
│       ├── OfflineAssessmentSubmitted.cs
│       └── OfflineAssignmentSubmitted.cs
│
└── LmsOffline.Tests/
    ├── WindowEnforcementPolicyTests.cs
    └── SyncConflictResolutionTests.cs
```

### Why Avalonia over Flutter or plain React for this client

Avalonia is a cross-platform .NET UI framework (desktop, and mobile/WASM) using XAML + C#/MVVM, which lets this client **directly reuse domain contracts, value objects, and validation logic already defined in the backend's `Contracts/` and `SharedKernel/` projects** without re-implementing them in a second language.[file:98][file:115] This directly satisfies the architecture mandate to keep business logic independent from frameworks while still avoiding duplicate modeling effort across ecosystems.

### Enforcing immutable schedules offline

- `AvailabilityWindow` value objects are downloaded once online, signed by the backend, and treated as **read-only and tamper-evident** on the client — `WindowEnforcementPolicy` in the Domain layer refuses to start an assessment outside the window even if the device clock is manipulated, by cross-checking a signed schedule token via `ScheduleTokenVerifier`.
- `EncryptedSqliteContext` stores all offline data under SQLCipher-encrypted SQLite, satisfying the requirement that offline scheduling data "cannot be immutable" (i.e., must resist tampering) while remaining available with no internet connection.[file:78]
- `OutboxSyncProcessor` queues submissions locally and syncs them the moment connectivity returns, applying conflict rules server-side (first valid submission within window wins).

## 4. `libs/` — Deliberately Small Shared Frontend Kernel

```text
libs/
├── ui-kit/
│   ├── components/
│   ├── tokens/                     # design tokens (colors, spacing, typography)
│   └── theming/
│
├── auth-sdk/
│   ├── react/
│   │   ├── AuthProvider.tsx
│   │   ├── useAuth.ts
│   │   └── silentRefresh.ts
│   └── dotnet/
│       └── OidcClient.cs           # shared with lms-offline-avalonia
│
├── api-clients/
│   ├── academic/
│   │   ├── registrarCurriculumApi.ts
│   │   └── examinationResultApi.ts
│   ├── student-lifecycle/
│   │   └── studentInformationReadModel.ts
│   ├── administration/
│   │   └── financeBillingApi.ts
│   ├── governance/
│   │   └── facilitiesAvailabilityApi.ts
│   └── platform/
│       └── identityAccessAuthorizationApi.ts
│
├── domain-viewmodels/
│   ├── StudentProfileViewModel.ts
│   ├── InvoiceSummaryViewModel.ts
│   └── GrievanceCaseViewModel.ts
│
└── offline-sync/
    ├── syncEngineContracts.ts      # shared interface between lms-web and Avalonia docs
    └── conflictResolutionRules.md
```

`auth-sdk` and `api-clients` are the frontend equivalents of the backend's Shared Kernel test from Phase 6: only structural, universally agreed concerns (authentication tokens, generated API types, design tokens) are shared, while business view models remain read-only projections, never editable shared business entities, preventing the same "shared kernel becomes a shared database" failure mode on the frontend.[file:78][file:98]

## 5. `tests/` — One Category per Frontend Architectural Guarantee

```text
tests/
├── ArchitectureTests/
│   └── dependency-cruiser.config.js   # forbids apps importing another app's src directly
├── ComponentTests/
│   └── <per-app>/
├── E2ETests/
│   ├── StudentEnrollmentFlow.spec.ts
│   ├── OfflineQuizWindowFlow.spec.ts
│   └── HostelBillingFlow.spec.ts
├── AccessibilityTests/
│   └── wcag-audit.spec.ts
├── PerformanceTests/
│   └── lighthouse-budgets.json
└── SecurityTests/
    ├── tokenStorageAuditTests.ts       # verifies no tokens in localStorage
    └── cspComplianceTests.ts
```

`ArchitectureTests/dependency-cruiser.config.js` is the frontend's automated fitness function, blocking any app from importing another app's `src/` directly (only `libs/` may be shared), mirroring the backend's `NoCrossModuleDomainReferenceTests.cs`.[file:98][file:115]

## 6. Identity, Subdomains, and Edge Architecture

```text
Internet
  │
  ▼
Cloudflare (DNS, CDN, WAF, DDoS mitigation, TLS termination, per-subdomain routing)
  │
  ▼
Nginx Reverse Proxy (DMZ)
  │
  ├── student.university.edu   → student-portal (static build)
  ├── faculty.university.edu   → faculty-portal
  ├── admin.university.edu     → admin-portal
  ├── lms.university.edu       → lms-web
  ├── finance.university.edu   → finance-console
  ├── library.university.edu   → library-portal
  ├── governance.university.edu→ governance-console
  ├── portal.university.edu    → identity-portal (landing + routing)
  ├── auth.university.edu      → Identity Provider (OIDC/OAuth2)
  └── api.university.edu       → Backend API (UniversityErp.Api)
  │
  ▼
Application Services (backend modules) → Databases
```

Every app under `apps/` is a static build served behind Nginx, with Cloudflare as the outer edge (CDN + WAF + DDoS) and Nginx as the inner reverse proxy performing per-subdomain routing, TLS to backend upstreams, and rate limiting — this two-layer setup avoids exposing any origin server directly to the internet, consistent with the platform's Zero Trust and defense-in-depth requirements.[file:98]

## 7. Frontend-Specific ADRs

```text
domain/adr/
├── ADR-F01-avalonia-for-offline-lms-client.md
├── ADR-F02-react-ts-for-subdomain-web-portals.md
├── ADR-F03-shared-auth-sdk-across-react-and-dotnet.md
└── ADR-F04-indexeddb-vs-sqlite-offline-strategy-split.md
```

- **ADR-F01**: Avalonia chosen for the offline LMS client because it maximizes reuse of existing .NET domain contracts and enables consistent desktop-first offline behavior with a path to mobile.[file:98]
- **ADR-F02**: React TypeScript chosen for subdomain portals because PWA support (service workers, IndexedDB) covers light offline needs for web-first user journeys.
- **ADR-F03**: A shared `auth-sdk` (React + .NET variants) ensures every app, regardless of stack, delegates authentication identically to `auth.university.edu`, with no app implementing its own login.
- **ADR-F04**: IndexedDB is scoped to light offline caching in `lms-web`; SQLCipher-encrypted SQLite is scoped to the Avalonia client's heavy offline assessment/assignment engine — the two are never merged into one engine, avoiding duplicated and inconsistent sync logic.

## Governance Rules Enforced by This Structure

- No `apps/*` may import another app's `src/`; only `libs/*` may be shared, enforced by `ArchitectureTests/dependency-cruiser.config.js`.
- No app or client may implement its own authentication; all delegate to `auth-sdk`, which itself only talks to `auth.university.edu`.
- `libs/domain-viewmodels` are read-only projections; no frontend code may mutate business state directly — all writes go through typed `api-clients` calling backend commands.
- The offline LMS's `AvailabilityWindow` value object is treated as tamper-evident and verified against a signed server token before any assessment start, even fully offline.
- Cloudflare and Nginx configuration live in `ops/`, versioned alongside the apps they route to, so routing changes are reviewed with the same rigor as code changes.

## Summary

This frontend architecture is the direct mirror of the backend's Domain-Based Modular Architecture: one app per bounded-context cluster, a deliberately minimal shared kernel, contracts-only cross-boundary access, and a dedicated offline-capable Avalonia client for the one domain — LearningManagement — that has a genuine hybrid online/offline business requirement.[file:78][file:98] Nothing here was invented independently of the business model; every app, library, and ADR traces back to a specific bounded context, subdomain, or security requirement already established for this platform.
