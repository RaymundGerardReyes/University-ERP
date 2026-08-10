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
process_module "academic" "backend-academic" "feat" "implement academic modules domain logic and endpoints" \
  "University-ERP-Backend/src/Modules/Academic"

process_module "administration" "backend-administration" "feat" "implement administration finance logic and events" \
  "University-ERP-Backend/src/Modules/Administration"

process_module "platform" "backend-platform" "fix" "return HTTP 403 Forbidden on invalid credentials in login endpoint" \
  "University-ERP-Backend/src/Modules/Platform"

process_module "student-lifecycle" "backend-studentlifecycle" "feat" "implement admissions workflow and application status" \
  "University-ERP-Backend/src/Modules/StudentLifecycle"

process_module "bootstrap" "backend-bootstrap" "fix" "seed student default credentials for offline client authentication" \
  "University-ERP-Backend/src/Bootstrap"

process_module "backend-ops" "ops-backend" "feat" "add db migrations for admissions module" \
  "University-ERP-Backend/ops"

process_module "backend-docs" "docs-backend" "docs" "update backend architectural structure" \
  "University-ERP-Backend/structure.md"

# ================= FRONTEND APPS =================
process_module "admin-portal" "admin-portal" "feat" "update admin portal features and UI" \
  "University-ERP-Frontend/apps/admin-portal"

process_module "admissions-portal" "admissions-portal" "refactor!" "consolidate UX into 5 operational surfaces and unified Case Workspace" \
  "University-ERP-Frontend/apps/admissions-portal"

process_module "applicant-portal" "applicant-portal" "feat" "overhaul application wizard and submission flows" \
  "University-ERP-Frontend/apps/applicant-portal"

process_module "faculty-portal" "faculty-portal" "feat" "implement students dashboard and section roster features" \
  "University-ERP-Frontend/apps/faculty-portal"

process_module "finance-console" "finance-console" "feat" "implement tuition assessment and cashier modules" \
  "University-ERP-Frontend/apps/finance-console"

process_module "governance-console" "governance-console" "chore" "update vite config for governance console" \
  "University-ERP-Frontend/apps/governance-console"

process_module "identity-portal" "identity-portal" "feat" "add MFA and email integration features" \
  "University-ERP-Frontend/apps/identity-portal"

process_module "library-portal" "library-portal" "chore" "update vite config for library portal" \
  "University-ERP-Frontend/apps/library-portal"

process_module "lms-web" "lms-web" "feat" "add course administration and gradebook features" \
  "University-ERP-Frontend/apps/lms-web"

process_module "platform-console" "platform-console" "chore" "update vite config for platform console" \
  "University-ERP-Frontend/apps/platform-console"

process_module "lms-offline-client" "lms-offline-client" "feat" "implement dynamic SQLite repositories and align auth error handling" \
  "University-ERP-Frontend/clients/lms-offline-avalonia"

# CRITICAL FIX: Fixed path to strictly use University-ERP-Frontend only
process_module "registrar-portal" "registrar-portal" "feat" "implement curriculum, academic records, and enrollment workspaces" \
  "University-ERP-Frontend/apps/registrar-portal"

process_module "security-portal" "security-portal" "feat" "scaffold security portal application" \
  "University-ERP-Frontend/apps/security-portal"

process_module "student-portal" "student-portal" "feat" "implement online registration, cross-enrollment, and student financials" \
  "University-ERP-Frontend/apps/student-portal"

# ================= FRONTEND LIBS & CONFIG =================
process_module "frontend-libs" "frontend-libs" "feat" "update API clients and workflow SDKs" \
  "University-ERP-Frontend/libs"

process_module "frontend-infra" "frontend-infra" "chore" "update frontend workspace dependencies and config" \
  "University-ERP-Frontend/package.json" "University-ERP-Frontend/package-lock.json" "University-ERP-Frontend/bootstrap.sh" "University-ERP-Frontend/apps/structuring.md"

# ================= ROOT INFRASTRUCTURE =================
process_module "project-docs" "docs-project" "docs" "update root architecture, analysis, and status documentation" \
  "CodebaseInfrastructure.md" "structure.md" "logs.md" "newupdate.md" "Analysis_Task_Orchestration.md"

# Safely only add the release_all.sh script here (not the apps/ folder anymore!)
process_module "project-ops" "ops-project" "chore" "update isolated release script with patch versioning support" \
  "release_all.sh" "isolated_release.sh"

process_module "project-config" "config-project" "chore" "update root gitignore rules" \
  ".gitignore"

echo "----------------------------------------------------"
echo "All applicable modules have been safely committed and strictly isolated tags have been generated!"
echo "Please review with 'git log -n 24 --oneline' and then push with: git push origin main && git push --tags"
