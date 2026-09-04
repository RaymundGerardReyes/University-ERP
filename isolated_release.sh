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

    # Only tag if the commit is NOT a chore, docs, or test (per Semantic Versioning Rules)
    if [[ "$commit_type" != "chore" && "$commit_type" != "docs" && "$commit_type" != "test" ]]; then
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

# ================= BACKEND OPS =================
process_module "backend-ops" "ops-backend" "feat" "configure Nginx site availability for ERP domains" \
  "University-ERP-Backend/ops/nginx/sites-available"

# ================= FRONTEND APPS (Specific Files to avoid swallowing deleted tests) =================
process_module "applicant-portal" "applicant-portal" "fix" "resolve enrollment payment processing pages" \
  "University-ERP-Frontend/apps/applicant-portal/src/features/EnrollmentPayment/ApplicationFeePayment.page.tsx" \
  "University-ERP-Frontend/apps/applicant-portal/src/features/EnrollmentPayment/EnrollmentPayment.page.tsx"

process_module "registrar-portal" "registrar-portal" "fix" "stabilize enrollment activation flow" \
  "University-ERP-Frontend/apps/registrar-portal/src/features/Admissions/EnrollmentActivation.page.tsx"

# ================= FRONTEND TESTS =================
# This catches all deleted *.test.tsx in apps/ and the new tests/ directory
process_module "frontend-tests" "frontend-tests" "test" "migrate all test suites to centralized cross-portal architecture" \
  "University-ERP-Frontend/apps" \
  "University-ERP-Frontend/tests" \
  "University-ERP-Frontend/vitest.config.ts" \
  "generate-frontend-test-structure.sh"

# ================= FRONTEND INFRA =================
process_module "frontend-infra" "frontend-infra" "chore" "update test runner configuration and dependencies" \
  "University-ERP-Frontend/package.json" "University-ERP-Frontend/package-lock.json"

# ================= ROOT INFRA & DOCS =================
process_module "root-infra" "root-infra" "chore" "update port registry and docker compose environment" \
  ".env.example" "PORT_REGISTRY.md" "docker-compose.yml"

process_module "docs" "docs" "docs" "restructure architecture documentation and task orchestration logs" \
  "ERPstructure.md" "university-ERPstructure.md" "structure.md" "University-ERP-Backend/University-ERP-Backend.md" \
  "Analysis_Task_Orchestration.md" "runtimelogs.md" "tests.logs" "commit.logs"

process_module "release-scripts" "ops-release" "chore" "update release orchestration for test migration" \
  "isolated_release.sh"

echo "----------------------------------------------------"
echo "All applicable modules have been safely committed and strictly isolated tags have been generated!"
echo "Please review with 'git log -n 24 --oneline' and then push with: git push origin main && git push --tags"
