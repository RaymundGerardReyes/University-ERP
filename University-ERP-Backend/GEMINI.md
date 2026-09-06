# University-ERP Backend - Rules & Guidelines

This document governs all backend development within `University-ERP-Backend`.

---

## 1. Modular Monolith Architecture

The backend is organized into five high-level business domains containing isolated modules:
- `Academic`: `AcademicScheduling`, `Curriculum`, `StudentInformation`
- `Administration`: `Finance`, `Payroll`, `HumanResources`, `Facilities`
- `Governance`: `Audit`, `Policy`, `Accreditation`
- `Platform`: `IdentityAccess`, `Telemetry`
- `StudentLifecycle`: `Admissions`, `Enrollment`, `Graduation`

### Boundary Enforcement Rules
1. Modules communicate asynchronously through Integration Events or synchronously through MediatR contracts defined in `Contracts/`.
2. A module's internal `DbContext`, domain entities, and repositories are internal and must never be exposed to other modules.
3. Database tables for each module should reside in their own schema (e.g., `admissions.*`, `finance.*`).

---

## 2. Domain-Driven Design (DDD) & CQRS

1. **Entities & Aggregates**:
   - Entities must encapsulate their business invariants.
   - Mutations must occur through explicit methods on the Aggregate Root (e.g., `application.Approve(evaluatorId, notes)`).
   - Never expose public parameterless setters.
2. **Commands & Queries**:
   - Commands mutate state and return `Result` or `Result<T>`.
   - Queries perform read-only queries with `AsNoTracking()` and return DTOs.
3. **Domain Events**:
   - Raised inside aggregate methods via `AddDomainEvent(...)`.
   - Dispatched automatically upon `SaveChangesAsync()` by the MediatR domain event publisher.

---

## 3. Testing Standards

1. **Unit Tests**:
   - Located in `<Module>.Tests/Unit/`.
   - Test domain aggregates in isolation without database dependencies.
2. **Integration Tests**:
   - Located in `<Module>.Tests/Integration/`.
   - Utilize WebApplicationFactory and test containers or isolated test databases.

