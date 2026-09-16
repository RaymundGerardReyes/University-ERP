---
trigger: always_on
description: >-
  Enforces workflow-first regression testing, change impact analysis, business invariant preservation, and eliminates false-confidence testing anti-patterns across University-ERP.
---

# University-ERP Regression Testing Strategy & Change Impact Analysis Rules

This document establishes the mandatory protocol for protecting existing business behavior against regressions whenever code is added, modified, refactored, or upgraded across the monorepo.

---

## 1. The Core Regression Philosophy

Whenever touching existing code, agents and developers must NOT begin by asking *"What new test should I write?"*
Instead, always ask:
> **"What existing behavior could this change break?"**

### The Regression Formulation Process:
```text
Existing working behavior
      ↓
Identify what must never change
      ↓
Encode that behavior as a regression test
      ↓
Make every future change run those tests
```

### Unit Test vs. Regression Test Boundary:
- **Unit Test**: Verifies an isolated component's immediate response (e.g., *"Does `ActivateEnrollment()` reject an invalid state?"*).
- **Regression Test**: Verifies that previously working, end-to-end business behavior remains intact after changes across handlers, database schemas, events, or dependencies (e.g., *"Does the valid Admissions → Enrollment → Finance sequence still complete successfully without data corruption or skipped steps?"*).

---

## 2. Mandatory Change Impact Analysis (CIA) Protocol

Before applying any modification to backend aggregates, CQRS handlers, database configurations, or frontend features, perform dependency impact tracing:

```text
Changed Class
     ↓
Changed Method / Invariant
     ↓
Protected Business Rule
     ↓
Dependent Module(s)
     ↓
Integration Event / Public Contract
     ↓
Business Workflow
     ↓
Existing & Required Regression Tests
```

---

## 3. Four Canonical Business Workflow Regression Boundaries

All regression testing must prioritize the four core cross-module workflows:

1. **Admissions → Enrollment**:
   - `Submitted` → `Documents Verified` → `Interview Scheduled/Completed` → `Chairperson Recommended` → `Dean Endorsed` → `Payment Verified` → `Enrollment Activated` → `Student Enrolled`.
   - **Invariant**: No step may be bypassed. Directly calling `ActivateEnrollment()` from `Submitted` must fail.
2. **Enrollment → Academic Record & Student Identity**:
   - Upon `StudentEnrolledIntegrationEvent`, `StudentInformation` must auto-provision an academic record in `GOOD` standing (Cumulative GPA 0.00), and `IdentityAccess` must provision student credentials.
3. **Finance & Tuition Billing Lifecycle**:
   - `TotalAmount` → `Payment` → `Scholarship` → `Balance` → `Clearance`.
   - **Invariants**: Ledger cannot be marked `Cleared` while outstanding debt remains ($> 0$). Scholarship deductions must never exceed remaining balance.
4. **Grades → GPA → Academic Standing → Graduation Clearance**:
   - Grades locked → Outbox event → Recompute cumulative GPA → Standing evaluation (`GOOD` $\ge 2.0$, `PROBATION` $\ge 1.0$, `DISMISSED` $< 1.0$).
   - Graduation clearance requires $\ge 120$ credits, `GOOD` academic standing, 0 financial balance, and no disciplinary holds.

---

## 4. Forbidden Testing Anti-Patterns (Zero-Tolerance)

1. **No Hollow Scaffolded Tests**:
   - Test methods containing only comments (`// Arrange // Act // Assert`) or missing assertions are strictly forbidden. In xUnit, empty test methods pass silently, producing false confidence.
2. **No Superficial Frontend Tests**:
   - Tests asserting only that a page heading exists (`expect(screen.getByRole('heading')).toBeInTheDocument()`) are prohibited for feature verification. Tests must assert actual user interactions, API payload propagation, rendered badges, error alerts, and domain states.
3. **No Mismatched Mock Contracts**:
   - Frontend mocks must strictly match the TypeScript DTOs from `@university-erp/api-clients` (e.g., never return `{ eligible: true }` when the component expects `{ isEligible: true }`).
4. **No In-Memory DB False Confidence for Relational Constraints**:
   - Relational constraints (foreign keys, unique indexes, composite keys, NOT NULL columns, concurrency tokens) must be tested against PostgreSQL Testcontainers, never `UseInMemoryDatabase`.
5. **No Bypassing Domain Invariants via Backdoors**:
   - Aggregates must never expose public setters or arbitrary mutation methods (like `UpdateStatus(string status)`). State transitions must occur exclusively through validated domain methods that emit domain events.
6. **No Hand-Wired Event Shortcuts in Regression Flows**:
   - Regression workflows must exercise real MediatR dispatch, Outbox serialization, and consumer invocation to catch contract and serialization regressions.

