#!/bin/bash
set -e

# ==============================================================================
# Isolated Semantic Versioning & Release Engine
# Standard: SemVer 2.0.0 & Conventional Commits
# Governed by: .agents/rules/universal-semantic-versioning-prompt.md
# ==============================================================================

DRY_RUN=false
if [[ "$1" == "--dry-run" || "$1" == "-n" ]]; then
  DRY_RUN=true
  echo "===================================================================="
  echo "  DRY-RUN MODE ENABLED: Analyzing changes per SemVer 2.0.0"
  echo "  (No files will be staged, committed, or tagged)"
  echo "===================================================================="
fi

# 1. Unstage everything to prepare clean boundaries
if [ "$DRY_RUN" = false ]; then
  echo "Unstaging files to prepare for strictly isolated commits..."
  git reset
fi

# 2. Fetch remote tags to ensure accuracy and prevent tag collisions (skipped in dry-run)
if [ "$DRY_RUN" = false ]; then
  echo "Checking remote tags (fallback to local if unreachable)..."
  GIT_SSH_COMMAND="ssh -o BatchMode=yes -o ConnectTimeout=2" git fetch --tags origin 2>/dev/null || echo "Notice: Remote fetch skipped; using existing local tags."
fi

bump_patch() {
  local version=$1
  version=${version#v}
  if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    echo "${BASH_REMATCH[1]}.${BASH_REMATCH[2]}.$((BASH_REMATCH[3] + 1))"
  else
    echo "0.0.1"
  fi
}

bump_minor() {
  local version=$1
  version=${version#v}
  if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    echo "${BASH_REMATCH[1]}.$((BASH_REMATCH[2] + 1)).0"
  else
    echo "0.1.0"
  fi
}

bump_major() {
  local version=$1
  version=${version#v}
  if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    echo "$((BASH_REMATCH[1] + 1)).0.0"
  else
    echo "1.0.0"
  fi
}

# ==============================================================================
# process_module: Stages, commits, and conditionally tags an isolated concern
# Conforms to Conventional Commits:
#   <type>(<scope>): <summary, <=72 chars>
#
#   <body: bulleted rationale and file changes>
#
#   <footer: Refs and Coordination Notes>
# ==============================================================================
process_module() {
  local scope_name="$1"
  local tag_prefix="$2"
  local commit_type="$3"
  local commit_summary="$4"
  local commit_body="$5"
  local commit_footer="$6"
  shift 6
  local paths=("$@")

  # Detect any modified, untracked, or deleted files in target paths
  local changes=""
  for p in "${paths[@]}"; do
    if [ -n "$(git ls-files -m -o -d --exclude-standard "$p")" ]; then
      changes="yes"
      break
    fi
  done

  if [ -n "$changes" ]; then
    echo "----------------------------------------------------"
    echo "Isolating and processing: $scope_name"
    
    # Filter paths to only those that exist or are tracked/deleted in git
    local valid_paths=()
    for p in "${paths[@]}"; do
      if [ -e "$p" ] || [ -n "$(git ls-files -d "$p")" ]; then
        valid_paths+=("$p")
      fi
    done

    if [ ${#valid_paths[@]} -eq 0 ]; then
      return
    fi

    local commit_header="${commit_type}(${scope_name}): ${commit_summary}"
    if [ "$DRY_RUN" = false ]; then
      git add "${valid_paths[@]}"
      echo "Committing: $commit_header"

      local commit_args=("-m" "$commit_header")
      if [ -n "$commit_body" ]; then
        commit_args+=("-m" "$commit_body")
      fi
      if [ -n "$commit_footer" ]; then
        commit_args+=("-m" "$commit_footer")
      fi

      git commit "${commit_args[@]}"
    else
      echo "[DRY-RUN] Scope: $scope_name"
      echo "[DRY-RUN] Proposed Commit Header: $commit_header"
      if [ -n "$commit_body" ]; then
        echo "[DRY-RUN] Proposed Commit Body:"
        echo "$commit_body"
      fi
      if [ -n "$commit_footer" ]; then
        echo "[DRY-RUN] Proposed Commit Footer: $commit_footer"
      fi
    fi

    # Tagging Decision Matrix per SemVer 2.0.0 (universal-semantic-versioning-prompt.md):
    # - feat (MINOR), fix/perf/refactor/build (PATCH), ! or BREAKING CHANGE (MAJOR)
    # - chore, docs, test, ci -> no release / no tag
    if [[ "$commit_type" != "chore" && "$commit_type" != "docs" && "$commit_type" != "test" && "$commit_type" != "ci" ]]; then
      local current_tag
      # Safely sort tags to find the absolute highest one matching the prefix
      current_tag=$(git tag -l "${tag_prefix}-v*" | sort -V | tail -n 1)
      
      local version_num
      if [ -z "$current_tag" ]; then
        version_num="0.0.0"
        current_tag="None"
      else
        version_num=${current_tag#${tag_prefix}-v}
      fi

      local next_version
      local bump_reason
      if [[ "$commit_type" == *"!"* || "$commit_type" == "major" || "$commit_type" == "breaking" || "$commit_footer" == *"BREAKING CHANGE"* ]]; then
        next_version=$(bump_major "$version_num")
        bump_reason="MAJOR (Breaking change or public contract alteration)"
      elif [[ "$commit_type" == "fix" || "$commit_type" == "patch" || "$commit_type" == "refactor" || "$commit_type" == "perf" || "$commit_type" == "build" ]]; then
        next_version=$(bump_patch "$version_num")
        bump_reason="PATCH (Backward-compatible bug fix, build update, or internal refactor)"
      else
        next_version=$(bump_minor "$version_num")
        bump_reason="MINOR (New backward-compatible functionality or feature addition)"
      fi

      local next_tag="${tag_prefix}-v${next_version}"

      if [ "$DRY_RUN" = false ]; then
        echo "Tagging $scope_name: Current($current_tag) -> Next($next_tag)"
        git tag -a "$next_tag" -m "${tag_prefix} Release ${next_version}

Included commits:
- ${commit_header}

${commit_body}

Bump reason: ${bump_reason}
Coordination Notes: ${commit_footer:-None}"
      else
        echo "[DRY-RUN] Tag Calculation: Current($current_tag) -> Proposed Next($next_tag)"
        echo "[DRY-RUN] Bump Reason: ${bump_reason}"
        echo "[DRY-RUN] Coordination Notes: ${commit_footer:-None}"
      fi
    else
      echo "Skipping tag for $scope_name because commit type is '$commit_type' (no release required per SemVer)."
    fi
  fi
}

echo "Starting isolated semantic versioning updates..."

# ==============================================================================
# CATEGORY A: BACKEND / CONTRACTS
# Runtime Scope: University-ERP-Backend/src/Contracts/
# ==============================================================================
process_module "contracts" "backend-contracts" "feat" \
  "generalize applicant identifier to string across integration events" \
  "- update PaymentVerifiedIntegrationEvent to use string ApplicantId
- update ApplicantAcceptedIntegrationEvent to use string ApplicantId
- support flexible applicant identifier formats across admissions and finance" \
  "Refs: Category A - Backend / Contracts (universal-semantic-versioning-prompt.md)" \
  "University-ERP-Backend/src/Contracts"

# ==============================================================================
# CATEGORY A: BACKEND / ACADEMIC DOMAIN
# Runtime Scope: University-ERP-Backend/src/Modules/Academic/
# ==============================================================================
process_module "academic" "backend-academic" "feat" \
  "implement degree programs, curriculum plans, and student consumers" \
  "- implement AcademicCurriculum and AcademicProgram domain aggregates in Curriculum
- add GetAllProgramsQuery and GetCurriculumByProgramQuery with MediatR handlers
- expose /curriculum/programs and /curriculum/programs/{programCode} minimal API endpoints
- implement StudentEnrolledIntegrationEventConsumer in StudentInformation module
- configure StudentAcademicRecordRepository and EF persistence mapping" \
  "Refs: Category A - Backend / Academic Domain (universal-semantic-versioning-prompt.md)" \
  "University-ERP-Backend/src/Modules/Academic"

# ==============================================================================
# CATEGORY A: BACKEND / ADMINISTRATION DOMAIN
# Runtime Scope: University-ERP-Backend/src/Modules/Administration/
# ==============================================================================
process_module "administration" "backend-administration" "fix" \
  "harden payment reconciliation and gateway URLs" \
  "- resolve hardcoded success and cancel URLs in BankingIntegrationService to use options
- add CheckoutBaseUrl option and add MarkFailed and Cancel states to PaymentSession
- update ProcessBankingCallbackCommandHandler to record payments on student billing invoices
- route payment gateway webhooks directly to banking callback command handler
- update CashierQueueEndpoint to update student billing and emit PaymentVerifiedIntegrationEvent
- add 27-branch Basis Path test suite covering all BankingIntegrationService HTTP paths" \
  "Refs: Category A - Backend / Administration Domain (universal-semantic-versioning-prompt.md)" \
  "University-ERP-Backend/src/Modules/Administration"

# ==============================================================================
# CATEGORY A: BACKEND / PLATFORM DOMAIN
# Runtime Scope: University-ERP-Backend/src/Modules/Platform/
# ==============================================================================
process_module "platform" "backend-platform" "fix" \
  "enable anonymous access for registration and update test runner" \
  "- add [AllowAnonymous] to RegisterUserEndpoint resolving 401 Unauthorized errors
- upgrade IdentityAccess.Tests project target framework to net10.0" \
  "Refs: Category A - Backend / Platform Domain (universal-semantic-versioning-prompt.md)" \
  "University-ERP-Backend/src/Modules/Platform"

# ==============================================================================
# CATEGORY A: BACKEND / STUDENT LIFECYCLE DOMAIN
# Runtime Scope: University-ERP-Backend/src/Modules/StudentLifecycle/
# ==============================================================================
process_module "student-lifecycle" "backend-studentlifecycle" "feat" \
  "implement application fee payment endpoint and expand lifecycle states" \
  "- implement POST /api/v1/admissions/applications/{id}/pay-fee endpoint
- add PayApplicationFeeCommand with transaction logging and status progression
- expand AdmissionApplication aggregate status transitions for review and interview states
- implement PaymentVerifiedIntegrationEventConsumer for automated fee reconciliation" \
  "Refs: Category A - Backend / Student Lifecycle Domain (universal-semantic-versioning-prompt.md)" \
  "University-ERP-Backend/src/Modules/StudentLifecycle"

# ==============================================================================
# CATEGORY A: BACKEND / BOOTSTRAP HOST & MIGRATOR
# Runtime Scope: University-ERP-Backend/src/Bootstrap/, UniversityErp.slnx
# ==============================================================================
process_module "bootstrap" "backend-bootstrap" "fix" \
  "fix tuple seeding and add payment checkout options" \
  "- resolve duplicate BSME tuple row and stale curriculum blocks in Migrator SQL seed
- eliminate duplicate AddWithValue parameter definitions across program offerings and curricula
- configure PaymentGateway:CheckoutBaseUrl options in API host appsettings" \
  "Refs: Category A - Backend / Bootstrap Host (universal-semantic-versioning-prompt.md)" \
  "University-ERP-Backend/src/Bootstrap" "UniversityErp.slnx"

# ==============================================================================
# CATEGORY A: BACKEND / END-TO-END INTEGRATION TEST SUITES
# Runtime Scope: University-ERP-Backend/tests/
# ==============================================================================
process_module "backend-tests" "backend-tests" "test" \
  "implement multi-module admission-to-enrollment end-to-end tests" \
  "- add 41 multi-module integration tests in UniversityErp.EndToEndTests
- verify admissions qualification, payment verification, and registrar handoff sagas" \
  "Refs: Category A - Backend Testing (universal-semantic-versioning-prompt.md)" \
  "University-ERP-Backend/tests"

# ==============================================================================
# CATEGORY B: SHARED FRONTEND LIBRARIES (API CLIENTS)
# Runtime Scope: University-ERP-Frontend/libs/api-clients/
# ==============================================================================
process_module "api-clients" "api-clients" "feat" \
  "standardize apiClient instance and expand curriculum and cashier APIs" \
  "- migrate all API client methods to centralized apiClient Axios instance with auth
- add registrarCurriculumApi methods for program offerings and subject catalog
- add financeBillingApi methods for OTC cash tokens and fee checkout
- expand admissionsApi with scheduleInterview and journey applicationId mapping" \
  "Refs: Category B - Shared Libraries (universal-semantic-versioning-prompt.md)" \
  "University-ERP-Frontend/libs/api-clients"

# ==============================================================================
# CATEGORY B: APPLICANT PORTAL
# Runtime Scope: University-ERP-Frontend/apps/applicant-portal/
# ==============================================================================
process_module "applicant-portal" "applicant-portal" "fix" \
  "resolve payment gateway redirects with fallback" \
  "- implement resolveCheckoutRedirectUrl to safely handle absolute banking gateway URLs
- support VITE_PAYMENT_GATEWAY_URL fallback resolution for relative checkout session endpoints
- update ApplicationFeePayment and EnrollmentPayment pages with redirect validation" \
  "Refs: Category B - Web Frontend (applicant-portal)" \
  "University-ERP-Frontend/apps/applicant-portal"

# ==============================================================================
# CATEGORY B: ADMISSIONS PORTAL
# Runtime Scope: University-ERP-Frontend/apps/admissions-portal/
# ==============================================================================
process_module "admissions-portal" "admissions-portal" "feat" \
  "implement applications management, stage queue, and document review" \
  "- implement Applications page with multi-criteria status and stage filtering
- implement AdmissionQueue with Secretary, Chairperson, and Registrar queue tabs
- implement ApplicationVerification with split-pane document viewer and preview modal" \
  "Refs: Category B - Web Frontend (admissions-portal)" \
  "University-ERP-Frontend/apps/admissions-portal"

# ==============================================================================
# CATEGORY B: FACULTY PORTAL
# Runtime Scope: University-ERP-Frontend/apps/faculty-portal/
# ==============================================================================
process_module "faculty-portal" "faculty-portal" "feat" \
  "connect curriculum matching and document verification to live APIs" \
  "- connect ChairpersonWorkspace CurriculumMatching to live subject catalog API
- connect SecretaryWorkspace DocumentVerification to live admissions queue
- add DocumentPreviewModal with dynamic document URL resolution" \
  "Refs: Category B - Web Frontend (faculty-portal)" \
  "University-ERP-Frontend/apps/faculty-portal"

# ==============================================================================
# CATEGORY B: FINANCE CONSOLE
# Runtime Scope: University-ERP-Frontend/apps/finance-console/
# ==============================================================================
process_module "finance-console" "finance-console" "feat" \
  "add payment monitor and align cashier slice" \
  "- upgrade PaymentGateway page to full transaction monitor with KPI cards
- add status filter tabs (ALL, PENDING, SUCCESS, FAILED) and status badges
- add GatewayStatusFilter and PaymentSessionRecord to PaymentGateway.types
- establish canonical Cashier.page.tsx DBMA slice with PaymentGateway alias
- align routes in Routing.tsx mapping /cashier/payments and /cashier/monitor" \
  "Refs: Category B - Web Frontend (finance-console)" \
  "University-ERP-Frontend/apps/finance-console"

# ==============================================================================
# CATEGORY B: REGISTRAR PORTAL
# Runtime Scope: University-ERP-Frontend/apps/registrar-portal/
# ==============================================================================
process_module "registrar-portal" "registrar-portal" "feat" \
  "implement curriculum division workspace and expand admissions queue" \
  "- implement CurriculumDivision workspace for curriculum and prerequisite management
- connect live subject catalog and prerequisite dependency chains in CurriculumDivision
- expand AdmissionsQueue with stage-aware actions and enrollment activation" \
  "Refs: Category B - Web Frontend (registrar-portal)" \
  "University-ERP-Frontend/apps/registrar-portal"

# ==============================================================================
# CATEGORY B: STUDENT PORTAL
# Runtime Scope: University-ERP-Frontend/apps/student-portal/
# ==============================================================================
process_module "student-portal" "student-portal" "fix" \
  "resolve payment gateway redirect URLs in financials" \
  "- implement resolveCheckoutRedirectUrl supporting absolute external bank URLs
- add VITE_PAYMENT_GATEWAY_URL fallback resolution for relative checkout redirects
- validate checkout session responses with user-friendly error notifications" \
  "Refs: Category B - Web Frontend (student-portal)" \
  "University-ERP-Frontend/apps/student-portal"

# ==============================================================================
# CATEGORY B: FRONTEND BUILD & TEST INFRASTRUCTURE
# Runtime Scope: University-ERP-Frontend/libs/vite-config/, vitest.config.ts
# ==============================================================================
process_module "frontend-infra" "frontend-infra" "build" \
  "configure Vite dev proxy fallback and disable Vitest file parallelism" \
  "- configure default http://localhost:5191 API target fallback in shared Vite proxy
- set fileParallelism: false in root vitest.config.ts to stabilize test suite execution" \
  "Refs: Category B - Web Frontend Build Infrastructure (universal-semantic-versioning-prompt.md)" \
  "University-ERP-Frontend/libs/vite-config" "University-ERP-Frontend/vitest.config.ts"

# ==============================================================================
# CATEGORY B: FRONTEND UNIT & INTEGRATION TEST SUITES
# Runtime Scope: University-ERP-Frontend/tests/
# ==============================================================================
process_module "frontend-tests" "frontend-tests" "test" \
  "stabilize 17 unit test suites across applicant, finance, and registrar" \
  "- add and stabilize unit test suites for ClearanceApproval, Scholarships, and SOA
- stabilize Cashier, FinancialReports, Payroll, and CurriculumDivision test suites
- update applicant-portal test suites with apiClient and payment flow mocks" \
  "Refs: Category B - Web Frontend Unit Testing (unit-testing.md)" \
  "University-ERP-Frontend/tests"

# ==============================================================================
# CATEGORY D: INFRASTRUCTURE & CONTAINER ORCHESTRATION
# Runtime Scope: docker-compose.yml, University-ERP-Frontend/Dockerfile.build-all
# ==============================================================================
process_module "docker" "ops-docker" "build" \
  "add payment gateway checkout base URL to compose" \
  "- configure PaymentGateway__CheckoutBaseUrl environment mapping in api and worker
- harmonize payment gateway options across container orchestration boundaries" \
  "Refs: Category D - Infrastructure / Docker (universal-semantic-versioning-prompt.md)" \
  "docker-compose.yml" "University-ERP-Frontend/Dockerfile.build-all"

# ==============================================================================
# CATEGORY D: ARCHITECTURE & MONOREPO DOCUMENTATION
# Runtime Scope: university-ERPstructure.md, University-ERP-Frontend/university-ERPstructure.md
# ==============================================================================
process_module "docs" "ops-docs" "docs" \
  "update frontend structure and feature boundary catalog" \
  "- document feature directories for finance-console and cashier DBMA slices
- update component registry and structure documentation" \
  "Refs: Category D - Documentation (universal-semantic-versioning-prompt.md)" \
  "university-ERPstructure.md" "University-ERP-Frontend/university-ERPstructure.md"

# ==============================================================================
# CATEGORY D: RELEASE MANAGEMENT & AUTOMATION ENGINE
# Runtime Scope: isolated_release.sh
# ==============================================================================
process_module "ops-release" "ops-release" "chore" \
  "align release metadata and SemVer classifications" \
  "- update commit summaries and bodies across modified scopes
- align release metadata with universal semantic versioning prompt guidelines
- ensure tag calculations and commit types strictly reflect working tree diffs" \
  "Refs: Category D - Release Management (universal-semantic-versioning-prompt.md)" \
  "isolated_release.sh"

echo "----------------------------------------------------"
if [ "$DRY_RUN" = true ]; then
  echo "DRY RUN COMPLETE: All scopes evaluated per SemVer 2.0.0."
  echo "No changes were staged, committed, or tagged."
  echo "To execute actual release, run:"
  echo "  ./isolated_release.sh"
else
  echo "All applicable modules have been safely committed and strictly isolated tags have been generated!"
  echo "Please review with 'git log -n 25 --oneline' and verify tags with: git tag -l --sort=-v:refname | head -n 20"
  echo "To push commits and tags to GitHub, run:"
  echo "  git push origin main && git push origin --tags"
fi
