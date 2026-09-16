---
trigger: glob
glob: "University-ERP-Backend/**"
description: >-
  Rules for .NET 10 Clean Architecture, DDD, CQRS with MediatR, and Entity Framework Core domain modeling across the 22 backend bounded contexts.
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
│   └── Endpoints/              # ASP.NET Core 10 Minimal API endpoint mappings
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

---

## 6. Payment Session & Gateway Integration Invariants

1. **Dynamic Return URL Propagation**:
   - `CreatePaymentSessionCommand` and `CreatePaymentSessionRequest` must accept an optional `ReturnUrl`.
   - The `PaymentSession` aggregate root must store `ReturnUrl` to maintain an audit trail of the client redirection target.
   - `IPaymentGatewayService.CreateCheckoutSessionAsync` must pass the client-provided `ReturnUrl` to the payment provider (falling back to configured `SuccessUrl` only if not specified).

2. **Session Validation Status Exposure**:
   - `ValidatePaymentSessionQuery` must include the current `Status` string in `PaymentSessionDto`.
   - The validation query handler must NOT reject completed or paid sessions with a 404 error; it must return the session DTO with its `Status` so the frontend redirect callback can verify completion after asynchronous webhook processing.

---

## 7. Solution Target Framework & Multi-Runtime Parity Invariants

1. **Monolith-Wide .NET 10 (`net10.0`) Parity**:
   - All backend bounded context source projects (`Domain`, `Application`, `Infrastructure`, `Presentation`, `Contracts`, `Bootstrap`) and test projects (`*.Tests.csproj`) must target `.NET 10` (`net10.0`).
   - Never mix `net9.0` with `net10.0` across module layers or test runners, and avoid duplicate `<TargetFramework>` entries in project property groups.
   - Run solution-wide compilation checks using `dotnet build UniversityErp.slnx` to guarantee clean dependencies across all 22 bounded contexts.

2. **Test Scaffolding & Code Generation Invariants**:
   - All scripts and tools that scaffold backend modules, test templates, or project files (e.g., `generate-test-templates-v2.sh`, `scaffold-backend-tests.sh`, and `backend-cqrs-scaffolder`) must generate `<TargetFramework>net10.0</TargetFramework>` and package references compatible with .NET 10.
   - Never commit or leave outdated target frameworks in automation scripts.

