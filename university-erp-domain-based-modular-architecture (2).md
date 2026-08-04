# University ERP — Domain-Based Modular Architecture (DBMA)

## What "Domain-Based Modular Architecture" Means Here

Domain-Based Modular Architecture (DBMA) is the specific architectural style applied to this University ERP: a modular monolith whose module boundaries are drawn strictly from Domain-Driven Design bounded contexts, where each module is internally self-contained (its own Domain/Application/Infrastructure/Presentation/Contracts/Tests), exposes itself to the rest of the system only through explicit contracts and a self-registering composition root, and can be physically split into an independent service later without redesign.[web:80][web:91][web:53] This pattern is documented in the DDD-crew/Kamil Grzybek "domain-centric modular monolith" school of thought, where each module owns its own composition root and initializes itself rather than being wired up ad hoc by a central startup file.[web:91][web:89][web:87]

This document formalizes that pattern precisely against the domain model and backend structure already produced, and expands every top-level folder you specified into its full, justified internal contents.[file:78][file:79]

## Governing Principle

> Modules define the boundaries of the system. Vertical slices organize the code within those boundaries.[web:83]

DBMA applies this at two levels simultaneously:

- **Macro level** — the `Modules/` tree below is drawn one-to-one from the Bounded Contexts identified in Phase 4 of the domain model; nothing is grouped by technical concern (no `Controllers/`, `Services/`, `Repositories/` at the root).[file:78]
- **Micro level** — inside each module, features are organized as vertical slices (one folder per use case, containing its command/query, validator, handler, and result together) rather than horizontal technical layers duplicated per feature.[web:88][web:90][web:50]

## Full Repository Tree

```text
university-erp-backend/
│
├── domain/
│   ├── model/
│   ├── adr/
│   └── runbooks/
│
├── src/
│   ├── Bootstrap/
│   │   ├── UniversityErp.Api/
│   │   ├── UniversityErp.Worker/
│   │   └── UniversityErp.Migrator/
│   │
│   ├── SharedKernel/
│   │   ├── SharedKernel.Domain/
│   │   ├── SharedKernel.Application/
│   │   ├── SharedKernel.Infrastructure/
│   │   └── SharedKernel.Observability/
│   │
│   ├── Modules/
│   │   ├── Academic/
│   │   │   ├── StudentInformation/
│   │   │   ├── Registrar/
│   │   │   ├── Examination/
│   │   │   ├── LearningManagement/
│   │   │   └── AcademicScheduling/
│   │   │
│   │   ├── StudentLifecycle/
│   │   │   ├── Admissions/
│   │   │   ├── Hostel/
│   │   │   ├── HealthCenter/
│   │   │   ├── GuidanceCounseling/
│   │   │   ├── PlacementCareer/
│   │   │   └── Alumni/
│   │   │
│   │   ├── Administration/
│   │   │   ├── Finance/
│   │   │   ├── HumanResources/
│   │   │   ├── Payroll/
│   │   │   ├── Procurement/
│   │   │   ├── Inventory/
│   │   │   ├── AssetManagement/
│   │   │   ├── Library/
│   │   │   ├── Transport/
│   │   │   ├── MessCanteen/
│   │   │   └── Facilities/
│   │   │
│   │   ├── Governance/
│   │   │   ├── GrievanceManagement/
│   │   │   ├── Helpdesk/
│   │   │   ├── EventManagement/
│   │   │   ├── VisitorManagement/
│   │   │   └── QualityAccreditation/
│   │   │
│   │   └── Platform/
│   │       ├── IdentityAccess/
│   │       ├── Notification/
│   │       ├── Communication/
│   │       ├── DocumentManagement/
│   │       ├── AnalyticsBI/
│   │       ├── CRM/
│   │       └── MultiCampus/
│   │
│   └── Contracts/
│       ├── PublicApiContracts/
│       └── IntegrationEvents/
│
├── tests/
│   ├── ArchitectureTests/
│   ├── DomainTests/
│   ├── ContractTests/
│   ├── IntegrationTests/
│   ├── EndToEndTests/
│   ├── PerformanceTests/
│   └── SecurityTests/
│
└── ops/
    ├── db-migrations/
    ├── observability/
    └── pipelines/
```

Every folder below is expanded with exact contents, rationale, and the DDD phase or architectural pattern it enforces.[file:78][file:79]

## 1. `domain/` — Business Knowledge as a First-Class Artifact

```text
domain/
├── model/
│   ├── business-capability-map.md
│   ├── ubiquitous-language-glossary.md
│   ├── bounded-context-catalog.md
│   ├── context-map.md
│   ├── aggregate-catalog.md
│   ├── entity-catalog.md
│   ├── value-object-catalog.md
│   ├── domain-event-catalog.md
│   └── business-rules-catalog.md
│
├── adr/
│   ├── ADR-001-modular-monolith-over-microservices.md
│   ├── ADR-002-shared-kernel-scope-restriction.md
│   ├── ADR-003-anti-corruption-layer-health-guidance.md
│   ├── ADR-004-event-driven-cross-module-integration.md
│   └── ADR-NNN-template.md
│
└── runbooks/
    ├── incident-response/
    │   ├── finance-invoice-outbox-stuck.md
    │   ├── identityaccess-outage.md
    │   └── grievance-sla-breach-storm.md
    ├── module-onboarding/
    │   └── new-bounded-context-checklist.md
    └── data-recovery/
        └── student-enrollment-rollback.md
```

The `domain/model/` files are living copies of the DDD Domain Model document (Phases 1–9), kept in the repository rather than only in external documentation, so that the business model and the code cannot silently drift apart.[file:78] ADRs record why the Shared Kernel was restricted, why microservices were deferred, and why the ACL exists between Health/Guidance and StudentInformation, exactly as decided in the domain model, giving future engineers the reasoning, not just the rule.[file:78] Runbooks translate Phase 11 (Observability) and Phase 12 (Security) into operational, step-by-step incident procedures per module, which reduces mean time to recovery because responders do not have to reconstruct domain knowledge during an outage.[file:78][file:79]

## 2. `src/Bootstrap/` — Composition Roots, Not Business Logic

```text
Bootstrap/
├── UniversityErp.Api/
│   ├── Program.cs
│   ├── ModuleRegistration/
│   │   ├── AcademicModulesRegistration.cs
│   │   ├── StudentLifecycleModulesRegistration.cs
│   │   ├── AdministrationModulesRegistration.cs
│   │   ├── GovernanceModulesRegistration.cs
│   │   └── PlatformModulesRegistration.cs
│   ├── Middleware/
│   │   ├── CorrelationIdMiddleware.cs
│   │   ├── GlobalExceptionMiddleware.cs
│   │   └── AuthorizationDelegationMiddleware.cs
│   └── appsettings/
│       ├── appsettings.json
│       └── appsettings.Production.json
│
├── UniversityErp.Worker/
│   ├── Program.cs
│   ├── Consumers/
│   │   ├── AcademicEventConsumers.cs
│   │   ├── FinanceEventConsumers.cs
│   │   └── GovernanceEventConsumers.cs
│   └── ScheduledJobs/
│       ├── TermStartBatchInvoicingJob.cs
│       ├── PayrollMonthlyBatchJob.cs
│       ├── SlaBreachScannerJob.cs
│       └── WaitlistPromotionJob.cs
│
└── UniversityErp.Migrator/
    ├── Program.cs
    └── MigrationRunners/
        └── PerModuleMigrationRunner.cs
```

Each module exposes a single self-registration extension method (for example `AddStudentInformationModule(...)`), and `UniversityErp.Api/Program.cs` only calls these extension methods in sequence; it never contains business wiring itself.[web:87][web:91] This satisfies the composition-root pattern for module autonomy, where each module can construct its own dependency graph, which solves the practical problem of a single 2,000-line `Program.cs` becoming an unreviewable bottleneck, follows the modular monolith composition-root principle, and prevents the long-term maintenance risk of hidden coupling introduced accidentally at the wiring layer.[web:91][web:89]

The Worker host is a distinct process boundary for event consumers and scheduled jobs (Phase 9's scheduled jobs: batch invoicing, payroll runs, SLA scanning, waitlist promotion), which exists to isolate long-running or bursty background load from the request/response API host, addressing a real scalability concern (peak registration or payroll runs must not degrade API latency) and reducing debugging complexity by separating synchronous and asynchronous failure domains.[file:78][file:79]

## 3. `src/SharedKernel/` — Deliberately Small, Deliberately Boring

```text
SharedKernel/
├── SharedKernel.Domain/
│   ├── Primitives/            # Entity, AggregateRoot, ValueObject, DomainEvent, Result
│   ├── ValueObjects/          # Person, Address, EmailAddress, PhoneNumber, Money
│   ├── Identifiers/           # StudentId, EmployeeId, CampusId (opaque references only)
│   └── Audit/                 # AuditInfo
│
├── SharedKernel.Application/
│   ├── Abstractions/          # ICommand, IQuery, ICommandHandler, IQueryHandler
│   ├── Behaviors/             # ValidationBehavior, LoggingBehavior, AuthorizationBehavior
│   ├── Pagination/            # PagedResult, PageRequest
│   └── Results/                # Result<T>, Error
│
├── SharedKernel.Infrastructure/
│   ├── Outbox/                 # OutboxMessage, OutboxProcessorBase
│   ├── Inbox/                  # InboxMessage, InboxDeduplicationBase
│   ├── Persistence/             # BaseEntityConfiguration, AuditInterceptor
│   └── Messaging/               # IIntegrationEventPublisher, IIntegrationEventBus
│
└── SharedKernel.Observability/
    ├── Logging/                 # StructuredLogEnricher, CorrelationIdAccessor
    ├── Tracing/                  # ActivitySourceRegistry
    ├── Metrics/                   # MeterRegistry
    └── HealthChecks/               # ModuleHealthCheckBase
```

Every item here passed the Phase 6 Shared Kernel test — universally agreed, structural, low-behavior — and no business aggregate (Student, Invoice, GrievanceCase, Room, etc.) is permitted here under any circumstance.[file:78] This exists because the single biggest failure mode of shared kernels in large systems is silent scope creep into shared business models, which re-couples every module that was supposed to be independent; keeping this kernel intentionally "boring" (only primitives, cross-cutting behaviors, and observability plumbing) follows the DDD shared-kernel discipline and prevents that specific long-term coupling failure.[web:80][file:78]

## 4. `src/Modules/` — One Folder per Bounded Context, No Exceptions

Each leaf module (StudentInformation, Finance, GrievanceManagement, etc.) uses the identical internal skeleton already established:

```text
Modules/<Cluster>/<BoundedContext>/
├── <BoundedContext>.Domain/
│   ├── Aggregates/
│   ├── Entities/
│   ├── ValueObjects/
│   ├── DomainEvents/
│   ├── DomainServices/
│   ├── Policies/
│   └── Exceptions/
│
├── <BoundedContext>.Application/
│   ├── ModuleRegistration.cs        # self-registration entry point
│   ├── Abstractions/
│   ├── Features/<UseCaseName>/
│   ├── EventHandlers/
│   │   ├── DomainEventHandlers/
│   │   └── IntegrationEventHandlers/
│   └── Mappings/
│
├── <BoundedContext>.Infrastructure/
│   ├── Persistence/
│   ├── Repositories/
│   ├── Outbox/
│   ├── Inbox/
│   ├── ExternalAdapters/
│   └── Observability/
│
├── <BoundedContext>.Presentation/
│   ├── Endpoints/
│   ├── Contracts/
│   ├── Filters/
│   └── OpenApi/
│
├── <BoundedContext>.Contracts/
│   ├── PublicApi/
│   └── IntegrationEvents/
│
├── <BoundedContext>.Tests.Unit/
├── <BoundedContext>.Tests.Integration/
└── <BoundedContext>.Tests.Architecture/
```

The addition specific to DBMA is `ModuleRegistration.cs` inside `<BoundedContext>.Application`, which is the module's own composition root: it registers its handlers, repositories, and event subscriptions, and is the only thing `Bootstrap` is allowed to call for that module.[web:91][web:89] This exists so each module could, in principle, be started as its own process with almost no change, satisfying the "future microservice extraction without significant redesign" requirement from the architecture mandate, and it reduces debugging effort because a failure in one module's wiring cannot silently affect another module's startup.[file:79][web:89]

### Cluster contents, exactly as specified

- **Academic**: StudentInformation, Registrar, Examination, LearningManagement, AcademicScheduling.[file:78]
- **StudentLifecycle**: Admissions, Hostel, HealthCenter, GuidanceCounseling, PlacementCareer, Alumni.[file:78]
- **Administration**: Finance, HumanResources, Payroll, Procurement, Inventory, AssetManagement, Library, Transport, MessCanteen, Facilities.[file:78]
- **Governance**: GrievanceManagement, Helpdesk, EventManagement, VisitorManagement, QualityAccreditation.[file:78]
- **Platform**: IdentityAccess, Notification, Communication, DocumentManagement, AnalyticsBI, CRM, MultiCampus.[file:78]

This clustering is not cosmetic — it mirrors the Business Capability Map exactly, so a change request phrased in business language ("update the hostel allocation rule") maps to exactly one folder path (`Modules/Administration/Hostel`) with no ambiguity, which is the core payoff of Domain-Based Modular Architecture over a technically-layered structure.[file:78][file:79]

## 5. `src/Contracts/` — The Only Legal Cross-Module Surface

```text
Contracts/
├── PublicApiContracts/
│   ├── Academic/
│   │   ├── Registrar.CurriculumApi.cs          # Open Host Service
│   │   └── Examination.ResultQueryApi.cs
│   ├── StudentLifecycle/
│   │   └── StudentInformation.StudentReadModel.cs
│   ├── Administration/
│   │   └── Finance.BillingApi.cs               # Open Host Service
│   ├── Governance/
│   │   └── Facilities.SpaceAvailabilityApi.cs  # Open Host Service
│   └── Platform/
│       └── IdentityAccess.AuthorizationApi.cs  # Open Host Service, consumed by ALL
│
└── IntegrationEvents/
    ├── Academic/
    │   ├── StudentEnrolledIntegrationEvent.cs
    │   └── ExamResultPublishedIntegrationEvent.cs
    ├── StudentLifecycle/
    │   ├── ApplicantAcceptedIntegrationEvent.cs
    │   └── RoomAllocatedIntegrationEvent.cs
    ├── Administration/
    │   ├── InvoiceIssuedIntegrationEvent.cs
    │   └── PayrollCalculatedIntegrationEvent.cs
    └── Governance/
        ├── GrievanceSubmittedIntegrationEvent.cs
        └── SupportTicketRequestedIntegrationEvent.cs
```

A module may reference another module's `Contracts` project and nothing else — never its `Domain`, `Application`, or `Infrastructure` project.[file:79] This is the literal code-level enforcement of the Phase 5 Context Map: Customer/Supplier and Open Host Service relationships become project references to `Contracts` only, Anti-Corruption Layers become explicit translation classes inside the consuming module's `Application/Mappings`, and nothing is ever a silent database join across modules.[file:78][file:79]

## 6. `tests/` — One Test Category per Architectural Guarantee

```text
tests/
├── ArchitectureTests/
│   ├── SharedKernelPurityTests.cs        # fails if a business aggregate leaks in
│   ├── NoCrossModuleDomainReferenceTests.cs
│   ├── ContractOnlyDependencyTests.cs
│   └── ModuleRegistrationConventionTests.cs
│
├── DomainTests/
│   ├── StudentInformation/EnrollmentInvariantTests.cs
│   ├── Finance/InvoiceBalancingTests.cs
│   ├── Hostel/RoomCapacityInvariantTests.cs
│   └── GrievanceManagement/EscalationChainTests.cs
│
├── ContractTests/
│   ├── PublicApiContracts/
│   └── IntegrationEvents/
│
├── IntegrationTests/
│   └── <PerModule>/RepositoryAndPersistenceTests.cs
│
├── EndToEndTests/
│   ├── AdmissionToEnrollmentFlow.cs
│   ├── HostelAllocationToBillingFlow.cs
│   └── GrievanceToFacilitiesFlow.cs
│
├── PerformanceTests/
│   ├── RegistrationPeakLoad.cs
│   ├── PayrollBatchCalculation.cs
│   └── InvoiceIssuanceThroughput.cs
│
└── SecurityTests/
    ├── AuthorizationPolicyTests.cs
    └── DataClassificationLeakTests.cs    # verifies Health/Guidance ACL isolation
```

`ArchitectureTests` is the automated enforcement layer for every DBMA rule stated above — it is what actually stops a developer from adding `Modules/Administration/Finance/Finance.Domain` referencing `Modules/StudentLifecycle/Hostel.Domain` directly.[file:79] This exists because unenforced architecture rules decay under delivery pressure, which solves the real-world governance problem of a fifty-plus-engineer team, follows the "fitness function" testing practice for evolutionary architecture, and prevents the long-term failure mode where documentation says one structure and the code says another.[file:78][file:79]

## 7. `ops/` — Operational Mirror of the Module Boundaries

```text
ops/
├── db-migrations/
│   ├── StudentInformation/
│   ├── Finance/
│   ├── Hostel/
│   ├── GrievanceManagement/
│   └── <one folder per module with its own migration history>/
│
├── observability/
│   ├── dashboards/
│   │   ├── academic-cluster-dashboard.json
│   │   ├── finance-cluster-dashboard.json
│   │   └── governance-cluster-dashboard.json
│   └── alert-rules/
│       ├── finance-invoice-failure-rate.yaml
│       ├── grievance-sla-breach.yaml
│       └── identityaccess-auth-latency.yaml
│
└── pipelines/
    ├── module-build/
    │   ├── academic-modules.pipeline.yaml
    │   ├── administration-modules.pipeline.yaml
    │   └── platform-modules.pipeline.yaml
    ├── module-test/
    │   └── per-module-test.pipeline.yaml
    └── module-release/
        └── selective-release.pipeline.yaml
```

Migrations are kept per-module (never one shared migration project) because each bounded context owns its own schema, matching the "database as implementation detail, owned per module" rule from the backend blueprint.[file:79] Dashboards and alert rules are grouped by the same clusters as the code, and pipelines are scoped so that a change to `Modules/Governance/Helpdesk` triggers only the Governance build/test/release pipeline rather than a full-platform rebuild, which directly supports CI/CD efficiency and reduces blast radius per deployment, both explicit non-functional requirements from the original SRS.[file:79][file:78]

## Cross-Cutting Rule Summary (DBMA Enforcement Table)

| Rule | Enforced By | DDD/Architecture Principle | Failure It Prevents |
|---|---|---|---|
| Module folder = bounded context, 1:1 | `Modules/` tree structure | Bounded Context (Phase 4) | Ambiguous feature ownership |
| No cross-module Domain/Infra references | `ArchitectureTests/NoCrossModuleDomainReferenceTests.cs` | Low coupling, dependency inversion | Hidden coupling, "big ball of mud" |
| Only `Contracts/` crosses module lines | `ArchitectureTests/ContractOnlyDependencyTests.cs` | Open Host Service / Published Language (Phase 5) | Breaking changes rippling silently |
| SharedKernel has no business aggregates | `ArchitectureTests/SharedKernelPurityTests.cs` | Shared Kernel discipline (Phase 6) | Shared kernel becoming a shared database |
| Each module self-registers via `ModuleRegistration.cs` | `Bootstrap/*/ModuleRegistration/` calling module extension methods | Composition Root autonomy | God-sized `Program.cs`, startup coupling |
| Each module owns its schema/migrations | `ops/db-migrations/<Module>/` | Database as implementation detail | Cross-module SQL joins, extraction blockers |
| Each module has isolated CI pipeline | `ops/pipelines/module-*/` | Independent deployability | Full-platform rebuilds for small changes |
| Every module has ArchitectureTests, DomainTests, etc. | `tests/<Category>/<Module>/` | Testability by design (Phase 14) | Untested invariants, undetected regressions |

## Why This Is the Right Long-Term Shape

Domain-Based Modular Architecture gives this University ERP the structural property that matters most for a 10–20 year system: **the cost of understanding any single change is bounded by one module, not by the whole platform**.[web:83][web:91] Because every module already behaves like an autonomous unit — its own composition root, its own schema, its own contracts, its own test suite — the eventual decision to extract, say, Finance or Notification into a separate service becomes an operational decision about deployment topology, not an emergency architectural rescue project.[web:89][web:53][file:79] That is the entire point of building a modular monolith the DDD way before ever discussing Kubernetes, message brokers, or service meshes.[file:78][file:79]
