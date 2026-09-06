---
trigger: glob
glob: "University-ERP-Backend/**"
description: >-
  Rules for .NET 9 Clean Architecture, DDD, CQRS with MediatR, and Entity Framework Core domain modeling across the 22 backend bounded contexts.
---

# Backend Clean Architecture & Domain-Driven Design (DDD) Rules

This document defines the architecture standards for code within `University-ERP-Backend`.

---

## 1. Module Layering Anatomy

Every bounded context under `src/Modules/<Domain>/<Module>/` is divided into five strictly decoupled layers:

```
src/Modules/<Domain>/<Module>/
├── <Module>.Domain/            # Pure C# enterprise logic
│   ├── Aggregates/             # Aggregate Roots & Child Entities
│   ├── Events/                 # IDomainEvent implementations
│   ├── Exceptions/             # DomainException definitions
│   └── ValueObjects/           # Immutable Value Objects
├── <Module>.Application/       # Application orchestration
│   ├── Abstractions/           # I<Aggregate>Repository interfaces
│   ├── Features/               # Vertical slice CQRS Commands & Queries
│   │   ├── <CommandName>/      # Command, Handler, Validator (FluentValidation)
│   │   └── <QueryName>/        # Query, Handler, DTO
│   ├── EventHandlers/          # In-process Domain Event Handlers
│   └── Consumers/              # Cross-module Integration Event Consumers
├── <Module>.Infrastructure/    # Persistence & External adapters
│   ├── Persistence/            # <Module>DbContext & EF Core EntityTypeConfigurations
│   ├── Repositories/           # Repository implementations
│   └── ModuleRegistration.cs   # DI container service registration extension method
├── <Module>.Presentation/      # HTTP interface
│   └── Endpoints/              # ASP.NET Core 9 Minimal API endpoint mappings
└── <Module>.Tests/             # 4-Tier Test Suite
    ├── Unit/                   # Fast isolated tests (Application & Domain)
    ├── Integration/            # Real DbContext & Endpoint pipeline tests
    ├── Regression/             # Defect prevention tests
    └── Security/               # RBAC & Authorization boundary tests
```

---

## 2. Domain Modeling & Invariant Encapsulation

### Aggregate Roots
- Aggregate roots must inherit from `AggregateRoot` or `AggregateRoot<TId>` in `SharedKernel.Domain`.
- Properties must have **private or internal setters**:
  ```csharp
  public class AdmissionApplication : AggregateRoot<ApplicationId>
  {
      public ApplicationStatus Status { get; private set; }
      public DateTime SubmittedAt { get; private set; }

      // Private constructor for EF Core materialization
      private AdmissionApplication() { }

      // Public factory method
      public static Result<AdmissionApplication> Create(...) { ... }

      // Mutating method enforcing domain invariant
      public Result Submit()
      {
          if (Status != ApplicationStatus.Draft)
              return Result.Failure("Only draft applications can be submitted.");

          Status = ApplicationStatus.Submitted;
          RaiseDomainEvent(new ApplicationSubmittedDomainEvent(Id));
          return Result.Success();
      }
  }
  ```
- All child collections must be exposed as `IReadOnlyCollection<T>` backed by private `List<T>` fields.

---

## 3. CQRS & MediatR Pattern

- **Commands** (`IRequest<Result>` or `IRequest<Result<TResponse>>`): Mutate state. Never return full database entities; return scalar IDs or concise operation results.
- **Queries** (`IRequest<Result<TDto>>`): Read-only operations. Must use `AsNoTracking()` in Entity Framework Core queries for optimal performance.
- **Pipeline Behaviors**:
  - Validation: Handled via `ValidationBehavior<TRequest, TResponse>` executing FluentValidation rules before handlers execute.
  - Logging & Metrics: Tracked automatically via `SharedKernel.Observability`.
- **Result Pattern**: Never throw exceptions for expected domain rule violations. Return `Result.Failure(Error)`. Reserve exceptions strictly for unexpected infrastructure failures.

---

## 4. Cross-Module Communication & Outbox Pattern

- Cross-module communication is **never direct**.
- Outgoing integration events must be registered in `UniversityErp.Contracts/IntegrationEvents/<Domain>/` and written to the Transactional Outbox within the same database transaction.
- Consuming modules subscribe via `IConsumer<TIntegrationEvent>` processed asynchronously by `UniversityErp.Worker`.

---

## 5. Persistence & Migrations

- Each module has its own dedicated `DbContext` and migration history.
- Never inject another module's `DbContext`.
- Database schema changes are executed centrally by `UniversityErp.Migrator` via `PerModuleMigrationRunner.cs`.
