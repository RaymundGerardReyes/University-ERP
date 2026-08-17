#!/bin/bash
set -e

# 1. Unstage everything so we can group files purely and strictly
echo "Unstaging files to prepare for strictly isolated commits..."
git reset

# 2. Fetch remote tags FIRST, to ensure we never overwrite or guess existing tags remotely
echo "Fetching remote tags to ensure accuracy and avoid existing tag collisions..."
git fetch --tags origin

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


process_module() {
  local scope_name="$1"
  local tag_prefix="$2"
  local commit_type="$3"
  local commit_desc="$4"
  shift 4
  local paths=("$@")

  # Check if there are any modified, untracked, or deleted files in the target paths
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
    
    # Git add only the strictly defined paths for this module
    git add "${paths[@]}"
    
    local commit_msg="${commit_type}(${scope_name}): ${commit_desc}"
    echo "Committing: $commit_msg"
    git commit -m "$commit_msg"

    # Only tag if the commit is NOT a chore or docs (per Semantic Versioning Rules)
    if [[ "$commit_type" != "chore" && "$commit_type" != "docs" ]]; then
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
      if [[ "$commit_type" == *"!"* || "$commit_type" == "major" || "$commit_type" == "breaking" ]]; then
        next_version=$(bump_major "$version_num")
        bump_reason="MAJOR (Breaking change or full UI overhaul)"
      elif [[ "$commit_type" == "fix" || "$commit_type" == "patch" || "$commit_type" == "refactor" || "$commit_type" == "perf" ]]; then
        next_version=$(bump_patch "$version_num")
        bump_reason="PATCH (Backward-compatible bug fix or internal refactor)"
      else
        next_version=$(bump_minor "$version_num")
        bump_reason="MINOR (New backward-compatible functionality)"
      fi

      local next_tag="${tag_prefix}-v${next_version}"

      echo "Tagging $scope_name: Current($current_tag) -> Next($next_tag)"
      git tag -a "$next_tag" -m "${tag_prefix} Release ${next_version}
Included commits:
- $commit_msg

Bump reason: ${bump_reason}"
    else
      echo "Skipping tag for $scope_name because commit type is '$commit_type' (no release needed)."
    fi
  fi
}

echo "Starting isolated semantic versioning updates..."

# ================= BACKEND MODULES =================
process_module "academic" "backend-academic" "feat" "implement Registrar clearance queues, UserRegistered consumer, and LMS module registration" \
  "University-ERP-Backend/src/Modules/Academic"

process_module "administration" "backend-administration" "feat" "implement StudentBilling and PaymentSession repositories with dynamic financial reconciliation endpoints" \
  "University-ERP-Backend/src/Modules/Administration"

process_module "platform" "backend-platform" "feat" "implement IdentityAccess and Notification integration event consumers" \
  "University-ERP-Backend/src/Modules/Platform"

process_module "student-lifecycle" "backend-studentlifecycle" "feat" "add admissions event handlers for enrollment transitions" \
  "University-ERP-Backend/src/Modules/StudentLifecycle"

process_module "bootstrap" "backend-bootstrap" "refactor" "update UniversityErp.Api Program.cs startup configuration" \
  "University-ERP-Backend/src/Bootstrap"

process_module "backend-contracts" "backend-contracts" "feat" "define academic and student lifecycle integration event contracts for saga orchestration" \
  "University-ERP-Backend/src/Contracts"

process_module "backend-ops" "ops-backend" "fix" "update Nginx proxy-common and site configurations for portals" \
  "University-ERP-Backend/ops"

process_module "backend-docs" "docs-backend" "docs" "update backend architectural structure" \
  "University-ERP-Backend/structure.md"

# ================= FRONTEND APPS =================
process_module "admin-portal" "admin-portal" "feat" "replace mock data in admissions processing views with dynamic TanStack Query hooks" \
  "University-ERP-Frontend/apps/admin-portal"

process_module "admissions-portal" "admissions-portal" "test" "stabilize enterprise test suite by providing mock routing and query client contexts" \
  "University-ERP-Frontend/apps/admissions-portal"

process_module "applicant-portal" "applicant-portal" "chore" "update vite.config.ts build configuration" \
  "University-ERP-Frontend/apps/applicant-portal"

process_module "faculty-portal" "faculty-portal" "feat" "update Teaching.page.tsx and vite.config.ts" \
  "University-ERP-Frontend/apps/faculty-portal"

process_module "finance-console" "finance-console" "feat" "connect PaymentGateway and StudentBilling components to live CQRS endpoints" \
  "University-ERP-Frontend/apps/finance-console"

process_module "payment-gateway" "payment-gateway" "chore" "update main entry component for React Strict Mode" \
  "University-ERP-Frontend/apps/payment-gateway"

process_module "governance-console" "governance-console" "fix" "implement robust basename fallback logic for dynamic Nginx subdirectories" \
  "University-ERP-Frontend/apps/governance-console"

process_module "identity-portal" "identity-portal" "fix" "harden root basename resolution and prevent infinite redirection loops in UserLogin" \
  "University-ERP-Frontend/apps/identity-portal"

process_module "library-portal" "library-portal" "fix" "implement robust basename fallback logic for dynamic Nginx subdirectories" \
  "University-ERP-Frontend/apps/library-portal"

process_module "lms-web" "lms-web" "fix" "implement robust basename fallback logic for dynamic Nginx subdirectories" \
  "University-ERP-Frontend/apps/lms-web"

process_module "platform-console" "platform-console" "fix" "implement robust basename fallback logic for dynamic Nginx subdirectories" \
  "University-ERP-Frontend/apps/platform-console"

process_module "lms-offline-client" "lms-offline-client" "feat" "implement dynamic SQLite repositories and align auth error handling" \
  "University-ERP-Frontend/clients/lms-offline-avalonia"

# CRITICAL FIX: Fixed path to strictly use University-ERP-Frontend only
process_module "registrar-portal" "registrar-portal" "feat" "update SubjectCatalog master-detail page and resolve form selection attributes" \
  "University-ERP-Frontend/apps/registrar-portal"

process_module "security-portal" "security-portal" "fix" "implement robust basename fallback logic for dynamic Nginx subdirectories" \
  "University-ERP-Frontend/apps/security-portal"

process_module "student-portal" "student-portal" "chore" "update vite.config.ts build configuration" \
  "University-ERP-Frontend/apps/student-portal"

# ================= FRONTEND LIBS & CONFIG =================
process_module "frontend-libs" "frontend-libs" "feat" "enhance Button and Table components and update ui-kit design system styles" \
  "University-ERP-Frontend/libs"

process_module "frontend-infra" "frontend-infra" "chore" "update Dockerfile.build-all instructions" \
  "University-ERP-Frontend/package.json" "University-ERP-Frontend/package-lock.json" "University-ERP-Frontend/bootstrap.sh" "University-ERP-Frontend/Dockerfile.build-all" "University-ERP-Frontend/tsconfig.app.base.json"

# ================= ROOT INFRASTRUCTURE =================
process_module "project-docs" "docs-project" "docs" "update logs.md with recent modernization events" \
  "CodebaseInfrastructure.md" "structure.md" "logs.md" "newupdate.md" "Analysis_Task_Orchestration.md" "ERPstructure.md" "SEMANTIC_VERSIONING_PROMPT.md" "universal-semantic-versioning-prompt.md" "university-erp-*.md"

# Safely only add the release_all.sh script here (not the apps/ folder anymore!)
process_module "project-ops" "ops-project" "chore" "update isolated_release.sh commit messages" \
  "release_all.sh" "isolated_release.sh" "docker-compose.yml" ".env.example" "health-logger.sh" "scaffold-frontend-cloudflare-nginx.sh" "scaffold_features.ps1" "setup_structure.ps1" "fix-encodings.js" ".dockerignore"

process_module "project-config" "config-project" "chore" "update root gitignore rules" \
  ".gitignore"

echo "----------------------------------------------------"
echo "All applicable modules have been safely committed and strictly isolated tags have been generated!"
echo "Please review with 'git log -n 24 --oneline' and then push with: git push origin main && git push --tags"
