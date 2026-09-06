#!/bin/bash
set -e

# ==============================================================================
# Isolated Semantic Versioning & Release Engine
# Standard: SemVer 2.0.0 & Conventional Commits
# Governed by: .agents/rules/universal-semantic-versioning-prompt.md
# ==============================================================================

# 1. Unstage everything to prepare clean boundaries
echo "Unstaging files to prepare for strictly isolated commits..."
git reset

# 2. Fetch remote tags to ensure accuracy and prevent tag collisions
echo "Fetching remote tags (fallback to local if remote unreachable)..."
git fetch --tags origin 2>/dev/null || echo "Notice: Remote fetch skipped; using existing local tags."

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
#   <body: bulleted rationale and file changes>
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

    git add "${valid_paths[@]}"
    
    local commit_header="${commit_type}(${scope_name}): ${commit_summary}"
    echo "Committing: $commit_header"
    
    local commit_args=("-m" "$commit_header")
    if [ -n "$commit_body" ]; then
      commit_args+=("-m" "$commit_body")
    fi
    if [ -n "$commit_footer" ]; then
      commit_args+=("-m" "$commit_footer")
    fi

    git commit "${commit_args[@]}"

    # Tagging Decision Matrix per SemVer 2.0.0 (universal-semantic-versioning-prompt.md):
    # - feat (MINOR), fix/perf/refactor/build (PATCH), ! or BREAKING CHANGE (MAJOR)
    # - chore, docs, test, ci -> no release / no tag
    if [[ "$commit_type" != "chore" && "$commit_type" != "docs" && "$commit_type" != "test" && "$commit_type" != "ci" ]]; then
      local current_tag
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

      echo "Tagging $scope_name: Current($current_tag) -> Next($next_tag)"
      git tag -a "$next_tag" -m "${tag_prefix} Release ${next_version}

Included commits:
- ${commit_header}

${commit_body}

Bump reason: ${bump_reason}
Coordination Notes: ${commit_footer:-None}"
    else
      echo "Skipping tag for $scope_name because commit type is '$commit_type' (no release required per SemVer)."
    fi
  fi
}

echo "Starting isolated semantic versioning updates..."

# ==============================================================================
# CATEGORY D: AI AGENT RULES, SKILLS & GOVERNANCE
# Runtime Scope: .agents/, GEMINI.md, universal-semantic-versioning-prompt.md
# ==============================================================================
process_module "ops-agents" "ops-agents" "feat" \
  "introduce Antigravity AI rules and skills customization library" \
  "- register 6 contextual agent rules (.agents/rules/) covering architecture boundaries, DBMA, clean architecture, unit testing, and SemVer
- provide 6 specialized domain skills (.agents/skills/) for test execution, CQRS scaffolding, event tracing, and port management
- add hierarchical GEMINI.md guidelines at root, backend, and frontend levels
- relocate universal-semantic-versioning-prompt.md into managed agent rules directory" \
  "Refs: Category D - Infrastructure / Operations (universal-semantic-versioning-prompt.md)" \
  ".agents" \
  "GEMINI.md" \
  "University-ERP-Backend/GEMINI.md" \
  "University-ERP-Frontend/GEMINI.md" \
  "universal-semantic-versioning-prompt.md"

# ==============================================================================
# CATEGORY B: FRONTEND UNIT TESTS & TEST SCAFFOLDING
# Runtime Scope: University-ERP-Frontend/tests/, generate-frontend-test-structure.sh
# ==============================================================================
process_module "frontend-tests" "frontend-tests" "test" \
  "escape apostrophes in unit test descriptions and fix generator" \
  "- convert single-quoted it.todo strings to double quotes across 171 test files to eliminate JS parse syntax errors
- patch generate-frontend-test-structure.sh template to generate double-quoted test titles
- restore clean discovery and execution for 276 Vitest test suites across all 14 portals" \
  "Refs: Category B - Web Frontend Unit Testing Standards (unit-testing.md)" \
  "University-ERP-Frontend/tests" \
  "generate-frontend-test-structure.sh"

# ==============================================================================
# CATEGORY B: FRONTEND BUILD & TEST RUNNER INFRASTRUCTURE
# Runtime Scope: University-ERP-Frontend/package.json, vitest.config.ts
# ==============================================================================
process_module "frontend-infra" "frontend-infra" "build" \
  "configure vitest runner and react jsx transform plugin" \
  "- add vitest and @vitejs/plugin-react to root frontend workspace devDependencies
- register react() plugin in vitest.config.ts to support TSX/JSX transformation under jsdom
- regenerate package-lock.json with cleanly hoisted dependencies" \
  "Refs: Category B - Web Frontend Build Configuration (universal-semantic-versioning-prompt.md, PATCH)" \
  "University-ERP-Frontend/package.json" \
  "University-ERP-Frontend/package-lock.json" \
  "University-ERP-Frontend/vitest.config.ts"

# ==============================================================================
# CATEGORY D: ROOT MONOREPO TOOLING & ENVIRONMENT
# Runtime Scope: package.json, .env.example, PORT_REGISTRY.md, docker-compose.yml
# ==============================================================================
process_module "root-infra" "ops-project" "chore" \
  "add root test execution scripts and maintain environment configs" \
  "- add 'test' and 'test:frontend' scripts delegating to vitest in root package.json
- maintain port registry and docker compose orchestration boundaries" \
  "Refs: Category D - Monorepo Orchestration" \
  "package.json" \
  "PORT_REGISTRY.md" \
  "docker-compose.yml"

# ==============================================================================
# CATEGORY D: RELEASE MANAGEMENT & AUTOMATION
# Runtime Scope: isolated_release.sh
# ==============================================================================
process_module "ops-release" "ops-release" "chore" \
  "align isolated release engine with universal semantic versioning rules" \
  "- implement multi-line Conventional Commits formatting (header, body, footer)
- update module paths, tags, and SemVer bump reasoning per universal-semantic-versioning-prompt.md
- ensure auditability with structured git tag annotations" \
  "Refs: Category D - Release Management (universal-semantic-versioning-prompt.md)" \
  "isolated_release.sh"

# ==============================================================================
# HISTORICAL / CONTINUOUS PIPELINE TARGETS (Preserved for ongoing development)
# ==============================================================================
process_module "backend-ops" "ops-backend" "feat" \
  "configure Nginx reverse proxy site availability for ERP domains" \
  "- declare active site configuration files under ops/nginx/sites-available
- configure routing and rate-limiting snippets for all 14 portal subdomains" \
  "Refs: Category D - Infrastructure / Operations" \
  "University-ERP-Backend/ops/nginx/sites-available"

process_module "applicant-portal" "applicant-portal" "fix" \
  "resolve enrollment payment processing pages and state handoff" \
  "- stabilize ApplicationFeePayment.page.tsx and EnrollmentPayment.page.tsx
- connect payment verification to admissions onboarding lifecycle" \
  "Refs: Category B - Web Frontend (applicant-portal)" \
  "University-ERP-Frontend/apps/applicant-portal/src/features/EnrollmentPayment/ApplicationFeePayment.page.tsx" \
  "University-ERP-Frontend/apps/applicant-portal/src/features/EnrollmentPayment/EnrollmentPayment.page.tsx"

process_module "registrar-portal" "registrar-portal" "fix" \
  "stabilize enrollment activation flow and student status transitions" \
  "- harden EnrollmentActivation.page.tsx against null student identifiers
- enforce registrar clearance guards prior to status activation" \
  "Refs: Category B - Web Frontend (registrar-portal)" \
  "University-ERP-Frontend/apps/registrar-portal/src/features/Admissions/EnrollmentActivation.page.tsx"

process_module "docs" "docs" "docs" \
  "restructure architecture documentation and task orchestration logs" \
  "- synchronize bounded context and aggregate catalogs
- update runtime and testing logs across active development milestones" \
  "Refs: Category D - Documentation" \
  "ERPstructure.md" "university-ERPstructure.md" "structure.md" "University-ERP-Backend/University-ERP-Backend.md" \
  "Analysis_Task_Orchestration.md" "runtimelogs.md" "tests.logs" "commit.logs"

echo "----------------------------------------------------"
echo "All applicable modules have been safely committed and strictly isolated tags have been generated!"
echo "Please review with 'git log -n 10 --oneline' and verify tags with: git tag -l --sort=-v:refname | head -n 10"
