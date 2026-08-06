#!/bin/bash

# =========================================================================
# University ERP - Universal Semantic Versioning Release Script
# Auto-generated based on CodebaseInfrastructure.md SemVer Guidelines
# =========================================================================

echo "Starting Multi-Runtime Git Release..."

# -------------------------------------------------------------------------
# 1. Root / Docs (No specific runtime tag, bumping root to v0.11.0)
# -------------------------------------------------------------------------
git add CodebaseInfrastructure.md newupdate.md package.json package-lock.json University-ERP-Frontend/scaffold_features.ps1 scaffold_features.ps1
git commit -m "docs(repo): update architecture documentation and build tools

- Updated CodebaseInfrastructure.md with DDD mappings
- Updated root dependencies
Refs: Universal SemVer Guidelines"
git tag -a v0.11.0 -m "Root Repository Release v0.11.0

Included commits:
- docs(repo): update architecture documentation and build tools
Bump reason: MINOR (Architecture alignment)"

# -------------------------------------------------------------------------
# 2. Backend Monolith
# -------------------------------------------------------------------------
git add University-ERP-Backend/src/
git commit -m "refactor(backend): enforce DBMA and unify API DI bootstrap

- Implemented EF Core Repositories across academic/platform/governance modules
- Decoupled UniversityErp.Api Bootstrap layer
- Added missing CQRS Handlers
Refs: Category A - Backend (Internal refactoring and DI unification)"
git tag -a backend-v0.16.0 -m "Backend Release v0.16.0

Included commits:
- refactor(backend): enforce DBMA and unify API DI bootstrap
Bump reason: MINOR (Internal module decoupling and additive DI configuration)
Coordination Notes: Requires API Client generation to sync frontend."

# -------------------------------------------------------------------------
# 3. API Clients (Shared Libs)
# -------------------------------------------------------------------------
git add University-ERP-Frontend/libs/api-clients/
git commit -m "feat(api-clients): generate DDD-compliant API sdk clients

- Regenerated frontend SDKs to match unified backend endpoints
Refs: Category B - Shared Library Update"
git tag -a api-clients-v0.3.0 -m "API Clients Release v0.3.0

Included commits:
- feat(api-clients): generate DDD-compliant API sdk clients
Bump reason: MINOR (Additive client methods)"

# -------------------------------------------------------------------------
# 4. Admin Portal
# -------------------------------------------------------------------------
git add University-ERP-Frontend/apps/admin-portal/
git commit -m "feat(admin-portal): sync UI routing and feature hooks with API

- Updated UI boundary mappings and Routing hooks
Refs: Category B - Web Frontend"
git tag -a admin-portal-v0.4.0 -m "Admin Portal Release v0.4.0

Included commits:
- feat(admin-portal): sync UI routing and feature hooks with API
Bump reason: MINOR (Feature hooks aligned with API clients)"

# -------------------------------------------------------------------------
# 5. Applicant Portal
# -------------------------------------------------------------------------
git add University-ERP-Frontend/apps/applicant-portal/
git commit -m "feat(applicant-portal): sync application timeline and wizard

- Updated application flows and eligibility checker hooks
Refs: Category B - Web Frontend"
git tag -a applicant-portal-v0.5.0 -m "Applicant Portal Release v0.5.0

Included commits:
- feat(applicant-portal): sync application timeline and wizard
Bump reason: MINOR (Application flow synced with unified backend)"

# -------------------------------------------------------------------------
# 6. Faculty Portal
# -------------------------------------------------------------------------
git add University-ERP-Frontend/apps/faculty-portal/
git commit -m "feat(faculty-portal): sync teaching and advising features

- Updated teaching, advising, and research module hooks
Refs: Category B - Web Frontend"
git tag -a faculty-portal-v0.5.0 -m "Faculty Portal Release v0.5.0

Included commits:
- feat(faculty-portal): sync teaching and advising features
Bump reason: MINOR (Aligned features with unified API)"

# -------------------------------------------------------------------------
# 7. Student Portal
# -------------------------------------------------------------------------
git add University-ERP-Frontend/apps/student-portal/
git commit -m "feat(student-portal): sync enrollment and timetable features

- Updated timetable mapping and enrollment configurations
Refs: Category B - Web Frontend"
git tag -a student-portal-v1.1.0 -m "Student Portal Release v1.1.0

Included commits:
- feat(student-portal): sync enrollment and timetable features
Bump reason: MINOR (Non-breaking feature alignment)"

# -------------------------------------------------------------------------
# 8. Finance Console
# -------------------------------------------------------------------------
git add University-ERP-Frontend/apps/finance-console/
git commit -m "feat(finance-console): update student billing integration

- Updated finance reporting and billing clients
Refs: Category B - Web Frontend"
git tag -a finance-console-v0.3.0 -m "Finance Console Release v0.3.0"

# -------------------------------------------------------------------------
# 9. Governance Console
# -------------------------------------------------------------------------
git add University-ERP-Frontend/apps/governance-console/
git commit -m "feat(governance-console): scaffold missing feature components

- Scaffolded new Accreditation and Visitor Management boundaries
Refs: Category B - Web Frontend"
git tag -a governance-console-v0.3.0 -m "Governance Console Release v0.3.0"

# -------------------------------------------------------------------------
# 10. Identity Portal
# -------------------------------------------------------------------------
git add University-ERP-Frontend/apps/identity-portal/
git commit -m "feat(identity-portal): secure authentication settings

- Updated user login and MFA integrations
Refs: Category B - Web Frontend"
git tag -a identity-portal-v0.4.0 -m "Identity Portal Release v0.4.0"

# -------------------------------------------------------------------------
# 11. Library Portal
# -------------------------------------------------------------------------
git add University-ERP-Frontend/apps/library-portal/
git commit -m "feat(library-portal): update catalog and reservation routing

- Updated reservation and digital resources hooks
Refs: Category B - Web Frontend"
git tag -a library-portal-v0.3.0 -m "Library Portal Release v0.3.0"

# -------------------------------------------------------------------------
# 12. LMS Web
# -------------------------------------------------------------------------
git add University-ERP-Frontend/apps/lms-web/
git commit -m "feat(lms-web): align assignment and grading features

- Updated LMS offline and grading features
Refs: Category B - Web Frontend"
git tag -a lms-web-v0.3.0 -m "LMS Web Release v0.3.0"

# -------------------------------------------------------------------------
# 13. Platform Console
# -------------------------------------------------------------------------
git add University-ERP-Frontend/apps/platform-console/
git commit -m "feat(platform-console): update tenant and security feature stubs

- Updated database management and tenant routing
Refs: Category B - Web Frontend"
git tag -a platform-console-v0.3.0 -m "Platform Console Release v0.3.0"

echo "========================================================================="
echo "Done! Run 'git push origin --tags' and 'git push origin main' to sync."
echo "========================================================================="
