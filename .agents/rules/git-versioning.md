---
trigger: always_on
description: >-
  Rules for Git conventional commits, module-isolated release tagging, and semantic versioning via isolated_release.sh.
---

# Git, Conventional Commits & Isolated Release Rules

This document specifies the versioning, commit message structure, and release tagging rules for the University-ERP monorepo.

---

## 1. Conventional Commits Format

Every commit message must follow this exact format:

```text
<type>(<scope>): <short description in present tense>

[optional detailed body explaining why this change was made]

[optional footer: e.g. Closes #123, BREAKING CHANGE: ...]
```

### Commit Types
- `feat`: Net-new capability, endpoint, feature slice, or domain rule.
- `fix`: Bug fix, defective query resolution, or regression patch.
- `test`: Adding or refactoring automated tests without changing production logic.
- `refactor`: Code restructuring that neither fixes a bug nor adds a feature.
- `chore`: Dependency updates, tooling, build scripts, or repo maintenance.
- `docs`: Documentation, architecture decision records (ADRs), or runbooks.
- `perf`: Performance optimization, query indexing, or bundle-size reduction.
- `ci`: Changes to CI/CD pipelines, Dockerfiles, or GitHub Actions.

---

## 2. Canonical Scopes Inventory

Use exact scopes corresponding to the monorepo architecture:

### Backend Domain Scopes
- `academic`: Changes across AcademicScheduling, Assessments, Curriculum, Enrollment, Examination, LearningManagement, Registrar, StudentInformation, Teaching.
- `administration`: Changes across AssetManagement, Facilities, Finance, HumanResources, Inventory, Library, MessCanteen, Payroll, Procurement, Transport.
- `governance`: Changes across EventManagement, GrievanceManagement, Helpdesk, QualityAccreditation, VisitorManagement.
- `platform`: Changes across AnalyticsBI, Communication, CRM, DocumentManagement, IdentityAccess, MultiCampus, Notification.
- `student-lifecycle`: Changes across Admissions, Alumni, GuidanceCounseling, HealthCenter, Hostel, PlacementCareer.
- `shared-kernel`: Changes to primitives in `SharedKernel`.
- `contracts`: Changes to cross-module interfaces or integration events in `UniversityErp.Contracts`.

### Frontend Portal Scopes
- `admin-portal`, `admissions-portal`, `applicant-portal`, `faculty-portal`, `finance-console`, `governance-console`, `identity-portal`, `library-portal`, `lms-web`, `payment-gateway`, `platform-console`, `registrar-portal`, `security-portal`, `student-portal`.
- `lms-offline`: Avalonia desktop client.
- `frontend`: Cross-cutting changes affecting multiple portals.
- `frontend-tests`: Changes exclusively in `University-ERP-Frontend/tests/`.

### Shared Library Scopes
- `api-clients`, `auth-sdk`, `core-logger`, `domain-viewmodels`, `offline-sync`, `shell-kit`, `ui-kit`, `vite-config`, `workflow-sdk`.

### Infrastructure & Ops Scopes
- `docker`: `docker-compose.yml` or container configurations.
- `nginx`: Reverse proxy site configurations and SSL snippets.
- `cloudflare`: Zero Trust tunnel configs, Terraform DNS, or WAF rules.
- `observability`: Loki, Alloy, Grafana dashboard definitions, or alert rules.

---

## 3. Isolated Semantic Versioning Engine

Releases are managed by the automated engine `isolated_release.sh`:
- Each portal in `apps/` and each module in `src/Modules/` has an **independent release line**.
- Tags follow the format: `<scope>-v<Major>.<Minor>.<Patch>` (e.g. `admissions-portal-v1.2.0`, `finance-v2.0.1`).
- `test` and `chore` commits do NOT trigger semantic version bumps unless paired with a `feat` (MINOR) or `fix` (PATCH).
- `BREAKING CHANGE:` in the footer triggers a MAJOR bump for that specific scope.
