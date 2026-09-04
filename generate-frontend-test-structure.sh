#!/usr/bin/env bash
# generate-frontend-test-structure.sh
#
# Discovery-based, source-aware test scaffold generator for
# University-ERP-Frontend. Consolidates test generation into the single
# canonical path:
#
#   D:\University-ERP\University-ERP-Frontend\tests
#
# replacing the deprecated pattern of scattering *.test.tsx files loosely
# inside each feature folder alongside production code. Existing in-feature
# *.test.tsx files are NOT touched, moved, or deleted by this script — they
# keep working as-is. This script only ADDS the missing test categories
# (Integration, Path, Security, Regression, End-to-End) into the
# centralized tests/ tree, and can optionally fill Unit gaps too.
#
# CATEGORIES GENERATED (one sub-tree each, under tests/):
#   Unit          - component/hook logic in isolation
#   Integration    - feature wired to its real api client / query layer
#   PathTesting    - route resolution, guarded routes, conditional branches
#   Security       - auth guard enforcement, token handling, IDOR-style checks
#   Regression     - permanent home for fixed-bug coverage, empty until used
#   EndToEnd       - full user-flow scaffold via the portal shell
#
# PATTERN ANALYZED FROM THE EXISTING CODEBASE:
#   Every feature under apps/<portal>/src/features/<Feature>/ follows the
#   same file-naming convention:
#     <Feature>.page.tsx     (always present — the anchor file)
#     <Feature>.api.ts       (optional)
#     <Feature>.hooks.ts     (optional)
#     <Feature>.types.ts     (optional)
#     <Feature>.test.tsx     (existing unit test, left untouched)
#     components/*.tsx       (optional sub-components)
#   This script discovers that convention generically — it does not
#   hard-code feature names. Adding a new feature folder anywhere under
#   any apps/<portal>/src/features/ is automatically picked up next run.
#
# SAFETY GUARANTEES (validated by running this script twice against a
# mock replica, including a simulated manual edit and a simulated
# pre-existing colocated *.test.tsx file — both survived byte-for-byte):
#   - safe_write_file() is the single choke point for every write.
#   - Existing files are always skipped, never overwritten/renamed/deleted.
#   - Idempotent: re-running only fills gaps.
#   - No production file (page/api/hooks/types/component) is ever touched.

set -Eeuo pipefail
shopt -s lastpipe

FRONTEND_ROOT="University-ERP-Frontend"
APPS_ROOT="$FRONTEND_ROOT/apps"
LIBS_ROOT="$FRONTEND_ROOT/libs"
TESTS_ROOT="$FRONTEND_ROOT/tests"

# TestCategory -> [ folder | file suffix | label | guidance ]
# Single source of truth: add a category by adding one line here.
declare -A CATEGORY_FOLDER=(
  ["Unit"]="Unit"
  ["Integration"]="Integration"
  ["PathTesting"]="PathTesting"
  ["Security"]="Security"
  ["Regression"]="Regression"
  ["EndToEnd"]="EndToEnd"
)
declare -A CATEGORY_SUFFIX=(
  ["Unit"]="unit.test.tsx"
  ["Integration"]="integration.test.tsx"
  ["PathTesting"]="path.test.tsx"
  ["Security"]="security.test.tsx"
  ["Regression"]="regression.test.tsx"
  ["EndToEnd"]="e2e.spec.ts"
)
declare -A CATEGORY_LABEL=(
  ["Unit"]="Unit Testing"
  ["Integration"]="Integration Testing"
  ["PathTesting"]="Path Testing"
  ["Security"]="Security Testing"
  ["Regression"]="Regression Testing"
  ["EndToEnd"]="End-to-End Testing"
)
declare -A CATEGORY_GUIDANCE=(
  ["Unit"]="Unit-test scenarios should cover __FEATURE__'s hooks, pure rendering states, and prop-driven behavior in isolation, with the API layer mocked."
  ["Integration"]="Integration scenarios should verify __FEATURE__ wired to its real api client/query layer: loading, success, error, and empty-data states."
  ["PathTesting"]="Path-testing scenarios should cover every route/conditional branch __FEATURE__ participates in: guarded route access, redirect-on-unauthenticated, and role-based route visibility."
  ["Security"]="Security scenarios should verify __FEATURE__ enforces its auth guard, does not leak restricted data before authorization resolves, and does not expose sensitive fields in the DOM/network payload."
  ["Regression"]="Regression scenarios should be added here when a previously identified defect in __FEATURE__ is fixed, so it can never silently reappear."
  ["EndToEnd"]="End-to-end scenarios should exercise __FEATURE__ through the real portal shell/router against a running (or mocked) backend, following the actual user journey."
)
CATEGORY_ORDER="Unit Integration PathTesting Security Regression EndToEnd"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "Running in --dry-run mode: no files will be written."
fi

CREATED_COUNT=0
SKIPPED_COUNT=0
DISCOVERED_COUNT=0

# ---------------------------------------------------------------------------
# safe_write_file TARGET_PATH
#   Writes stdin to TARGET_PATH only if it does not already exist.
# ---------------------------------------------------------------------------
safe_write_file() {
  local target="$1"
  DISCOVERED_COUNT=$((DISCOVERED_COUNT + 1))

  if [[ -f "$target" ]]; then
    echo "  skip (already exists): $target"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    cat >/dev/null
    return
  fi

  if [[ "$DRY_RUN" == true ]]; then
    echo "  [dry-run] would create: $target"
    cat >/dev/null
    return
  fi

  mkdir -p "$(dirname "$target")"
  cat > "$target"
  echo "  created: $target"
  CREATED_COUNT=$((CREATED_COUNT + 1))
}

# ---------------------------------------------------------------------------
# find_feature_references FEATURE_DIR PORTAL_DIR
#   Dynamically resolves every production file belonging to one feature
#   slice: the *.page.tsx anchor, *.api.ts, *.hooks.ts, *.types.ts, and any
#   file under components/ — exactly the convention already used across
#   admin-portal, faculty-portal, finance-console, etc. Also always
#   includes the portal's shell context (Routing.tsx/AppShell.tsx) — the
#   frontend analogue of always including a module's ModuleRegistration.cs
#   on the backend: a generic, uniformly-applied rule, not a per-feature
#   special case. It is what makes "Path Testing" actually about routing.
# ---------------------------------------------------------------------------
find_feature_references() {
  local feature_dir="$1" portal_dir="$2"
  find "$feature_dir" -maxdepth 1 -type f \( -name '*.page.tsx' -o -name '*.api.ts' -o -name '*.hooks.ts' -o -name '*.types.ts' \) 2>/dev/null
  find "$feature_dir/components" -type f -name '*.tsx' 2>/dev/null
  find "$portal_dir/src/shell" -maxdepth 1 -type f \( -name 'Routing.tsx' -o -name 'AppShell.tsx' \) 2>/dev/null
}

# ---------------------------------------------------------------------------
# generate_feature_tests PORTAL FEATURE FEATURE_DIR PORTAL_DIR
#   Generates all six category files for one discovered feature slice.
# ---------------------------------------------------------------------------
generate_feature_tests() {
  local portal="$1" feature="$2" feature_dir="${3%/}" portal_dir="${4%/}"
  local refs
  mapfile -t refs < <(find_feature_references "$feature_dir" "$portal_dir")
  [[ ${#refs[@]} -eq 0 ]] && return

  for category in $CATEGORY_ORDER; do
    local folder="${CATEGORY_FOLDER[$category]}"
    local suffix="${CATEGORY_SUFFIX[$category]}"
    local label="${CATEGORY_LABEL[$category]}"
    local guidance="${CATEGORY_GUIDANCE[$category]//__FEATURE__/$feature}"
    local test_file="$TESTS_ROOT/$folder/$portal/${feature}.${suffix}"

    {
      echo "// Test Type: ${label}"
      echo "//"
      echo "// Portal: ${portal}"
      echo "// Feature: ${feature}"
      echo "//"
      echo "// Source References:"
      for ref in "${refs[@]}"; do
        echo "// $ref"
      done
      echo "import { describe, it } from 'vitest';"
      echo ""
      echo "describe('${feature} - ${label}', () => {"
      echo "  it.todo('${guidance}');"
      echo "});"
    } | safe_write_file "$test_file"
  done
}

# ---------------------------------------------------------------------------
# process_portal PORTAL_DIR
#   Discovers every feature slice under one portal's src/features/ and
#   generates its test scaffolds. Portals are discovered by directory
#   listing, not hard-coded — adding a 14th portal needs no script change.
# ---------------------------------------------------------------------------
process_portal() {
  local portal_dir="${1%/}"
  local portal
  portal="$(basename "$portal_dir")"
  local features_dir="$portal_dir/src/features"

  [[ -d "$features_dir" ]] || { echo "skip (no src/features): $portal"; return; }

  echo "== $portal =="
  for feature_path in "$features_dir"/*/; do
    [[ -d "$feature_path" ]] || continue
    local feature
    feature="$(basename "$feature_path")"
    generate_feature_tests "$portal" "$feature" "$feature_path" "$portal_dir"
  done
}

# ---------------------------------------------------------------------------
# process_lib LIB_DIR
#   Shared packages (ui-kit, auth-sdk, workflow-sdk, api-clients, etc.) get
#   Unit + Integration + Security only — EndToEnd/PathTesting/Regression at
#   the library level do not make sense without an app context, so they are
#   intentionally skipped here rather than generating empty noise files.
# ---------------------------------------------------------------------------
process_lib() {
  local lib_dir="${1%/}"
  local lib
  lib="$(basename "$lib_dir")"
  local src_dir="$lib_dir/src"
  [[ -d "$src_dir" ]] || src_dir="$lib_dir"

  echo "== libs/$lib =="
  while IFS= read -r -d '' source_file; do
    local base_name
    base_name="$(basename "$source_file")"
    base_name="${base_name%.*}"

    for category in Unit Integration Security; do
      local folder="${CATEGORY_FOLDER[$category]}"
      local suffix="${CATEGORY_SUFFIX[$category]}"
      local label="${CATEGORY_LABEL[$category]}"
      local guidance="${CATEGORY_GUIDANCE[$category]//__FEATURE__/$base_name}"
      local test_file="$TESTS_ROOT/$folder/libs/$lib/${base_name}.${suffix}"

      {
        echo "// Test Type: ${label}"
        echo "//"
        echo "// Library: ${lib}"
        echo "// Module: ${base_name}"
        echo "//"
        echo "// Source References:"
        echo "// $source_file"
        echo "import { describe, it } from 'vitest';"
        echo ""
        echo "describe('${base_name} - ${label}', () => {"
        echo "  it.todo('${guidance}');"
        echo "});"
      } | safe_write_file "$test_file"
    done
  done < <(find "$src_dir" -maxdepth 2 -type f \( -name '*.ts' -o -name '*.tsx' \) \
             -not -name '*.test.*' -not -name '*.spec.*' -not -name 'index.ts' -print0)
}

ensure_tests_readme() {
  local readme="$TESTS_ROOT/README.md"
  safe_write_file "$readme" <<'MD'
# University-ERP-Frontend/tests

Canonical, centralized test tree for the frontend workspace. This replaces
the deprecated pattern of scattering ad hoc test files across unrelated
locations. Existing in-feature `*.test.tsx` files (colocated next to each
`.page.tsx`) remain valid and untouched; this tree adds the categories they
do not cover.

| Folder | Category | Scope |
|---|---|---|
| Unit/ | Unit Testing | Component/hook logic in isolation, API mocked |
| Integration/ | Integration Testing | Feature wired to its real api client / query layer |
| PathTesting/ | Path Testing | Route resolution, guarded routes, conditional branches |
| Security/ | Security Testing | Auth guard enforcement, token handling, data exposure |
| Regression/ | Regression Testing | Permanent coverage for previously fixed defects |
| EndToEnd/ | End-to-End Testing | Full user journey through the real portal shell/router |

Generated by `scripts/generate-frontend-test-structure.sh`. Re-running the
script is safe: it only fills in files that do not exist yet.
MD
}

mkdir -p "$TESTS_ROOT"
ensure_tests_readme

if [[ -d "$APPS_ROOT" ]]; then
  for portal_dir in "$APPS_ROOT"/*/; do
    [[ -d "$portal_dir" ]] || continue
    process_portal "$portal_dir"
  done
else
  echo "Apps root not found: $APPS_ROOT"
fi

if [[ -d "$LIBS_ROOT" ]]; then
  for lib_dir in "$LIBS_ROOT"/*/; do
    [[ -d "$lib_dir" ]] || continue
    process_lib "$lib_dir"
  done
fi

echo ""
echo "=================================================="
echo "Frontend test-structure generation complete."
echo "Target tests root       : $TESTS_ROOT"
echo "Discovered target files : $DISCOVERED_COUNT"
echo "Created test files      : $CREATED_COUNT"
echo "Skipped (already exist) : $SKIPPED_COUNT"
echo "=================================================="
echo "Nothing was deleted, overwritten, or moved."
echo "Existing colocated *.test.tsx files are untouched."
echo "Fill in it.todo(...) scenarios with real assertions per category."
