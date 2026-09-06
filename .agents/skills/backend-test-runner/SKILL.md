---
name: backend-test-runner
description: >-
  Executes, filters, and debugs .NET 9 unit, integration, architecture, and regression tests across the 22 modular monolith backend modules in University-ERP-Backend.
---

# Backend Test Runner Skill

This skill provides precise commands and procedures for running .NET 9 tests across the 5 domain clusters, 22 bounded contexts, and centralized architecture suites in `University-ERP-Backend`.

---

## 1. Test Architecture Overview

Backend tests are organized at two levels:

1. **Per-Module Test Suites (`<Module>.Tests.csproj`)**:
   Located in `src/Modules/<Domain>/<Module>/<Module>.Tests/`.
   Divided into four test categories:
   - `Unit/`: Fast tests for MediatR Handlers, Validators, and Domain Aggregate invariants.
   - `Integration/`: ASP.NET Minimal API endpoint pipelines and real EF Core PostgreSQL persistence tests.
   - `Regression/`: Fixed bug and boundary verification tests.
   - `Security/`: Authorization delegation, RBAC, and input sanitization tests.

2. **Monolith-Wide Centralized Suites (`University-ERP-Backend/tests/`)**:
   - `ArchitectureTests`: Enforces clean architecture rules, contract-only dependencies, and shared kernel purity.
   - `EndToEndTests`: Multi-module business flows (e.g. `AdmissionToEnrollmentFlow`, `GrievanceToFacilitiesFlow`).
   - `PerformanceTests`: Throughput benchmarks (invoicing, payroll batch, registration peak load).
   - `SecurityTests`: Global authorization policies and data classification leak tests.

---

## 2. Test Execution Commands

Run from repo root (`D:\University-ERP`) or backend root (`D:\University-ERP\University-ERP-Backend`):

### Run Entire Backend Solution
```powershell
dotnet test UniversityErp.slnx
```

### Run Architecture Tests (Critical for Modular Monolith Integrity)
```powershell
dotnet test University-ERP-Backend/tests/ArchitectureTests/UniversityErp.ArchitectureTests.csproj
```

### Run Multi-Module End-to-End Tests
```powershell
dotnet test University-ERP-Backend/tests/EndToEndTests/UniversityErp.EndToEndTests.csproj
```

---

## 3. Targeted Per-Module Test Commands

### Academic Domain Modules
```powershell
# Admissions & Enrollment
dotnet test University-ERP-Backend/src/Modules/Academic/Enrollment/Enrollment.Tests/Enrollment.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Tests/StudentInformation.Tests.csproj

# Curriculum & Scheduling
dotnet test University-ERP-Backend/src/Modules/Academic/Curriculum/Curriculum.Tests/Curriculum.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Tests/AcademicScheduling.Tests.csproj

# Exams, Assessments & LMS
dotnet test University-ERP-Backend/src/Modules/Academic/Examination/Examination.Tests/Examination.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Academic/Assessments/Assessments.Tests/Assessments.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Tests/LearningManagement.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Tests/Registrar.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Academic/Teaching/Teaching.Tests/Teaching.Tests.csproj
```

### Administration Domain Modules
```powershell
# Finance & Billing
dotnet test University-ERP-Backend/src/Modules/Administration/Finance/Finance.Tests/Finance.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Administration/Payroll/Payroll.Tests/Payroll.Tests.csproj

# Operations & Facilities
dotnet test University-ERP-Backend/src/Modules/Administration/Facilities/Facilities.Tests/Facilities.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Administration/AssetManagement/AssetManagement.Tests/AssetManagement.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Administration/HumanResources/HumanResources.Tests/HumanResources.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Administration/Inventory/Inventory.Tests/Inventory.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Administration/Library/Library.Tests/Library.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Administration/MessCanteen/MessCanteen.Tests/MessCanteen.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Administration/Procurement/Procurement.Tests/Procurement.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Administration/Transport/Transport.Tests/Transport.Tests.csproj
```

### Governance Domain Modules
```powershell
dotnet test University-ERP-Backend/src/Modules/Governance/GrievanceManagement/GrievanceManagement.Tests/GrievanceManagement.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Governance/QualityAccreditation/QualityAccreditation.Tests/QualityAccreditation.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Governance/EventManagement/EventManagement.Tests/EventManagement.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Governance/Helpdesk/Helpdesk.Tests/Helpdesk.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Governance/VisitorManagement/VisitorManagement.Tests/VisitorManagement.Tests.csproj
```

### Platform Domain Modules
```powershell
dotnet test University-ERP-Backend/src/Modules/Platform/IdentityAccess/IdentityAccess.Tests/IdentityAccess.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Platform/Communication/Communication.Tests/Communication.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Platform/DocumentManagement/DocumentManagement.Tests/DocumentManagement.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Platform/AnalyticsBI/AnalyticsBI.Tests/AnalyticsBI.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Platform/CRM/CRM.Tests/CRM.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Platform/MultiCampus/MultiCampus.Tests/MultiCampus.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/Platform/Notification/Notification.Tests/Notification.Tests.csproj
```

### StudentLifecycle Domain Modules
```powershell
dotnet test University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Tests/Admissions.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/StudentLifecycle/Alumni/Alumni.Tests/Alumni.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/StudentLifecycle/GuidanceCounseling/GuidanceCounseling.Tests/GuidanceCounseling.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/StudentLifecycle/HealthCenter/HealthCenter.Tests/HealthCenter.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/StudentLifecycle/Hostel/Hostel.Tests/Hostel.Tests.csproj
dotnet test University-ERP-Backend/src/Modules/StudentLifecycle/PlacementCareer/PlacementCareer.Tests/PlacementCareer.Tests.csproj
```

---

## 4. Filtering Tests by Category

Use dotnet test filter expressions:

```powershell
# Run only Unit tests across the solution
dotnet test --filter "FullyQualifiedName~Unit"

# Run only Integration tests
dotnet test --filter "FullyQualifiedName~Integration"

# Run only Security tests
dotnet test --filter "FullyQualifiedName~Security"

# Run only Regression tests
dotnet test --filter "FullyQualifiedName~Regression"
```

---

## 5. Troubleshooting Integration Tests

1. **PostgreSQL Container Requirement**:
   Integration tests require a healthy local PostgreSQL instance:
   ```powershell
   docker compose up -d postgres
   ```
2. **Database Schema Cleanliness**:
   Integration tests utilize isolated database schemas per module test runner. If tests report schema conflicts, recreate the test database container:
   ```powershell
   docker compose restart postgres
   ```
