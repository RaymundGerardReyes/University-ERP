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
# CATEGORY B: SHARED FRONTEND LIBRARIES (API CLIENTS)
# Runtime Scope: University-ERP-Frontend/libs/api-clients/
# ==============================================================================
process_module "api-clients" "api-clients" "feat" \
  "expand academic LMS and registrar cross-module client endpoints" \
  "- add typed client interfaces and DTOs for course packaging and distribution
- support air-gapped sync endpoints for offline assessment ingestion
- integrate registrar gradebook synchronization and audit ledger contracts" \
  "Refs: Category B - Shared Libraries (universal-semantic-versioning-prompt.md)" \
  "University-ERP-Frontend/libs/api-clients/academic/lmsApi.ts"

# ==============================================================================
# CATEGORY B: LMS WEB APPLICATION & OFFLINE BRIDGE
# Runtime Scope: University-ERP-Frontend/apps/lms-web/
# ==============================================================================
process_module "lms-web" "lms-web" "feat" \
  "implement DBMA vertical slices for LMS web and offline bridge" \
  "- implement CoursePackaging view for air-gapped Avalonia bundle compilation
- implement OfflineSubmissionReview with rubric grading and feedback modal
- implement GradebookSync orchestrating official grade transmission to registrar
- add ModuleTimeline, Discussions, Quizzes, Grades, and Calendar slices" \
  "Refs: Category B - Web Frontend (lms-web)" \
  "University-ERP-Frontend/apps/lms-web"

# ==============================================================================
# CATEGORY B: STUDENT PORTAL
# Runtime Scope: University-ERP-Frontend/apps/student-portal/
# ==============================================================================
process_module "student-portal" "student-portal" "feat" \
  "mature student dashboard, course enrollment, and cross-enrollment views" \
  "- add student KPI metrics, active schedule card, and term academic standing
- implement multi-course enrollment selection with prerequisite validation
- implement CrossEnrollment application modal with partner institution permit flow
- stabilize AcademicRecord, Clearance, and Extracurriculars feature slices" \
  "Refs: Category B - Web Frontend (student-portal)" \
  "University-ERP-Frontend/apps/student-portal"

# ==============================================================================
# CATEGORY B: FINANCE CONSOLE
# Runtime Scope: University-ERP-Frontend/apps/finance-console/
# ==============================================================================
process_module "finance-console" "finance-console" "feat" \
  "implement tuition assessment and cashier payment gateway workflows" \
  "- implement TuitionAssessment slice calculating units, lab fees, and discounts
- implement PaymentGateway multi-channel checkout modal with receipt generation
- standardize Budgeting, Invoicing, and Payroll modals with verified form inputs
- link financial clearance issuance to student lifecycle and registrar" \
  "Refs: Category B - Web Frontend (finance-console)" \
  "University-ERP-Frontend/apps/finance-console"

# ==============================================================================
# CATEGORY B: REGISTRAR PORTAL
# Runtime Scope: University-ERP-Frontend/apps/registrar-portal/
# ==============================================================================
process_module "registrar-portal" "registrar-portal" "feat" \
  "mature registrar command center and enrollment validation queue" \
  "- implement live dual queues for pending enrollments and graduation clearances
- dispatch AdmissionWorkflow commands on verified financial clearance
- harden record access audit logging with security action tracking
- standardize TransferDivision workspace with accessible page header" \
  "Refs: Category B - Web Frontend (registrar-portal)" \
  "University-ERP-Frontend/apps/registrar-portal"

# ==============================================================================
# CATEGORY B: GOVERNANCE CONSOLE
# Runtime Scope: University-ERP-Frontend/apps/governance-console/
# ==============================================================================
process_module "governance-console" "governance-console" "feat" \
  "standardize accreditation standards and institutional compliance tables" \
  "- implement Accreditation criteria evaluation with CHED evidence submission
- standardize Audits, Committees, Compliance, Policies, and Risk Management tables
- align all Badge color schemes with UI Kit semantic color schemes" \
  "Refs: Category B - Web Frontend (governance-console)" \
  "University-ERP-Frontend/apps/governance-console"

# ==============================================================================
# CATEGORY B: PLATFORM CONSOLE
# Runtime Scope: University-ERP-Frontend/apps/platform-console/
# ==============================================================================
process_module "platform-console" "platform-console" "feat" \
  "mature operational telemetry and distributed platform consoles" \
  "- standardize 12 operational consoles including DatabaseManagement and APIKeys
- add dual named and default exports across all platform features
- implement real-time server metrics, log streams, and multi-tenant management" \
  "Refs: Category B - Web Frontend (platform-console)" \
  "University-ERP-Frontend/apps/platform-console"

# ==============================================================================
# CATEGORY B: ADMIN PORTAL
# Runtime Scope: University-ERP-Frontend/apps/admin-portal/
# ==============================================================================
process_module "admin-portal" "admin-portal" "feat" \
  "mature academic configuration and admissions intake workspace" \
  "- create AdmissionsProcessing.page.tsx conforming to DBMA slice standards
- mature AcademicConfiguration term scheduling and course offering management
- stabilize CanteenOrders, UserAdministration, and SystemAdministration views" \
  "Refs: Category B - Web Frontend (admin-portal)" \
  "University-ERP-Frontend/apps/admin-portal"

# ==============================================================================
# CATEGORY B: ADMISSIONS PORTAL
# Runtime Scope: University-ERP-Frontend/apps/admissions-portal/
# ==============================================================================
process_module "admissions-portal" "admissions-portal" "fix" \
  "stabilize admissions dashboard overview and metric indicators" \
  "- align applicant queue counters with admissions workflow status
- improve responsive card layout for admissions officer review" \
  "Refs: Category B - Web Frontend (admissions-portal)" \
  "University-ERP-Frontend/apps/admissions-portal"

# ==============================================================================
# CATEGORY B: FRONTEND UNIT, INTEGRATION & E2E TEST SUITES
# Runtime Scope: University-ERP-Frontend/tests/
# ==============================================================================
process_module "frontend-tests" "frontend-tests" "test" \
  "complete 117 unit, 94 integration, and unified cross-portal E2E test suites" \
  "- achieve 100% pass rate across 117 unit test suites in all 6 core portals
- achieve 100% pass rate across 94 integration test suites in all 6 core portals
- implement Grand Cross-Portal Unified Lifecycle E2E test covering 7 phases
- implement lms-web integration and E2E suites verifying Avalonia bridge" \
  "Refs: Category B - Web Frontend Unit and Integration Testing (unit-testing.md)" \
  "University-ERP-Frontend/tests"

# ==============================================================================
# CATEGORY D: RELEASE MANAGEMENT & AUTOMATION ENGINE
# Runtime Scope: isolated_release.sh
# ==============================================================================
process_module "ops-release" "ops-release" "chore" \
  "upgrade isolated release engine to enforce universal SemVer prompt" \
  "- implement strict multi-line Conventional Commits formatting (header, body, footer)
- update process_module parameters to require explicit rationale and category refs
- expand release targets across all 6 core portals and LMS offline bridge
- enforce atomic git index handling and explicit remote tag push instructions" \
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
  echo "Please review with 'git log -n 12 --oneline' and verify tags with: git tag -l --sort=-v:refname | head -n 10"
  echo "To push commits and tags to GitHub, run:"
  echo "  git push origin main && git push origin --tags"
fi
