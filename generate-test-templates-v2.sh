#!/usr/bin/env bash
# generate-test-templates-v2.sh
#
# Source-aware, traceability-first test scaffold generator for
# University-ERP-Backend. Supersedes generate-unit-test-templates.sh's
# hard-coded Fact-method bodies with an empty, comment-only class shell
# carrying dynamically resolved "Source References" for FIVE testing
# categories: Unit, Integration, EndToEnd, Regression, Security.
#
# KEY DIFFERENCE FROM THE PREVIOUS VERSION:
#   - No invented test methods (no Should_Create_Valid_X, no [Fact] stubs).
#     Every generated class body is a single guidance comment describing
#     what that testing category is responsible for, nothing more.
#   - Every generated file carries a "Source References:" comment block
#     that is NOT hard-coded. It is computed per class by (a) always
#     including the file where the class itself was discovered, (b) always
#     including that module's ModuleRegistration.cs (the DI/wiring context
#     every module has), and (c) grep-scanning every other .cs file in the
#     module for literal usages of the class name. Two different classes
#     will therefore get two different reference lists automatically.
#   - Output is organized by testing category first, then module, matching
#     the shape already used by the existing shared test suite under
#     Platform/SharedKernel/tests (DomainTests/EndToEndTests/SecurityTests),
#     generalized to five explicit categories instead of ad hoc names.
#
# SAFETY GUARANTEES (unchanged from the previous version, verified by
# running this script twice against a mock replica and diffing output):
#   - safe_write_file() is still the single choke point for every write.
#   - It checks for existing files first and skips them; nothing is ever
#     overwritten, renamed, moved, or deleted.
#   - Re-running is idempotent: only missing files get created.
#   - Adding a module or a new domain sub-folder needs no code changes.

set -Eeo pipefail
shopt -s lastpipe

BACKEND_ROOT="University-ERP-Backend/src/Modules"
# Tests are written co-located inside each module's own .Tests project,
# mirroring the established pattern in this codebase.

declare -A MODULES
MODULES["Academic"]="AcademicScheduling Assessments Curriculum Enrollment Examination LearningManagement Registrar StudentInformation Teaching"
MODULES["Administration"]="AssetManagement Facilities Finance HumanResources Inventory Library MessCanteen Payroll Procurement Transport"
MODULES["Governance"]="EventManagement GrievanceManagement Helpdesk QualityAccreditation VisitorManagement"
MODULES["Platform"]="AnalyticsBI CRM Communication DocumentManagement IdentityAccess MultiCampus Notification"
MODULES["StudentLifecycle"]="Admissions Alumni GuidanceCounseling HealthCenter Hostel PlacementCareer"

DOMAIN_CATEGORIES="Aggregates Entities ValueObjects Events Policies DomainServices Exceptions"

# TestType -> [ subfolder | class-name suffix | test-type label | guidance text ]
# This table is the ONLY place that knows about the five categories. Adding
# a sixth category later means adding one line here — no other code changes.
declare -A TEST_TYPE_SUFFIX=(
  ["Unit"]="Tests"
  ["Integration"]="IntegrationTests"
  ["EndToEnd"]="EndToEndTests"
  ["Regression"]="RegressionTests"
  ["Security"]="SecurityTests"
)
declare -A TEST_TYPE_LABEL=(
  ["Unit"]="Unit Testing"
  ["Integration"]="Integration Testing"
  ["EndToEnd"]="End-to-End Testing"
  ["Regression"]="Regression Testing"
  ["Security"]="Security Testing"
)
declare -A TEST_TYPE_GUIDANCE=(
  ["Unit"]="Unit-test scenarios should be derived from the actual responsibilities and behavior of __CLASS__."
  ["Integration"]="Integration scenarios should be derived from the actual interactions between __CLASS__ and its application/infrastructure dependencies."
  ["EndToEnd"]="End-to-end scenarios should be derived from the actual user/application flow associated with this feature."
  ["Regression"]="Regression scenarios should be added here when previously identified defects or behavior changes require permanent coverage."
  ["Security"]="Security scenarios should be derived from the authentication, authorization, validation, access-control, and data-protection responsibilities actually present in the referenced implementation."
)
TEST_TYPE_ORDER="Unit Integration EndToEnd Regression Security"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "Running in --dry-run mode: no files will be written."
fi

CREATED_COUNT=0
SKIPPED_COUNT=0
DISCOVERED_COUNT=0

extract_type_name() {
  local file="$1"
  grep -Eo '\bpublic[[:space:]]+(sealed[[:space:]]+|abstract[[:space:]]+|static[[:space:]]+|partial[[:space:]]+)*(class|record[[:space:]]+class|record[[:space:]]+struct|record)[[:space:]]+[A-Za-z0-9_]+' "$file" \
    | head -n1 \
    | awk '{print $NF}' || true
}

# extract_handler_name FILE
#   Extracts the *CommandHandler or *QueryHandler class name from a combined
#   Command+Handler file (e.g. GenerateReportCommand.cs that contains both
#   the command record and the handler class in the same file). Returns the
#   handler class name, or nothing if the file has no handler class.
extract_handler_name() {
  local file="$1"
  grep -Eo '\bpublic[[:space:]]+(sealed[[:space:]]+|abstract[[:space:]]+|partial[[:space:]]+)*class[[:space:]]+[A-Za-z0-9_]+(CommandHandler|QueryHandler|EventHandler)[[:space:]]' "$file" \
    | head -n1 \
    | grep -Eo '[A-Za-z0-9_]+(CommandHandler|QueryHandler|EventHandler)' || true
}

is_interface_only() {
  local file="$1"
  grep -Eq '\bpublic[[:space:]]+interface[[:space:]]' "$file" || false
}

# ---------------------------------------------------------------------------
# safe_write_file TARGET_PATH
#   Reads content from stdin, writes it ONLY if TARGET_PATH does not exist.
#   Requires `shopt -s lastpipe` (set above) so that when this function is
#   invoked as the last stage of a pipeline, it still runs in the CURRENT
#   shell — otherwise its counter updates would be lost in a subshell.
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
# find_source_references MODULE_ROOT MODULE CLASS_NAME PRIMARY_FILE
#   Dynamically resolves every production file relevant to CLASS_NAME:
#     1. The file where the class was discovered (always first).
#     2. That module's ModuleRegistration.cs, if one exists (always the
#        architectural wiring context for every module — not a per-class
#        special case, it applies identically to all modules).
#     3. Every other .cs file in the module (excluding generated test
#        folders) that literally mentions the class name — repositories,
#        handlers, endpoints, DbContexts, consumers, etc.
#   Output: de-duplicated, one path per line, in discovery order.
# ---------------------------------------------------------------------------
find_source_references() {
  local module_root="$1" module="$2" class_name="$3" primary_file="$4"

  {
    echo "$primary_file"

    find "$module_root" -maxdepth 3 -type f -name 'ModuleRegistration.cs' 2>/dev/null

    find "$module_root" -type f -name '*.cs' \
      -not -path '*/*.Tests/*' \
      -not -path '*/Generated/*' \
      -not -path '*/bin/*' \
      -not -path '*/obj/*' \
      -print0 2>/dev/null \
    | xargs -0 grep -lE "\\b${class_name}\\b" 2>/dev/null || true
  } | awk 'NF && !seen[$0]++'
}

# ---------------------------------------------------------------------------
# generate_test_module AREA MODULE CLASS_NAME KIND REF1 REF2 ...
#   Generates all five testing-category files for one discovered class.
#   KIND is the domain category (e.g. "Aggregates") for domain types,
#   or "handler" / "validator" for application-layer types.
#
#   Files are written co-located inside the module's own .Tests project:
#     Unit/Domain/{Category}/     for domain types (Aggregates, Entities, etc.)
#     Unit/Application/           for command/query handlers
#     Unit/Validators/            for FluentValidation validators
#     Integration/Persistence/    for domain persistence integration tests
#     Integration/Endpoints/      for handler/endpoint integration tests
#     Regression/                 for regression defect coverage
#     Security/                   for authorization and data-protection tests
# ---------------------------------------------------------------------------
generate_test_module() {
  local area="$1" module="$2" class_name="$3" kind="${4:-}"
  shift 4
  local refs=("$@")
  local module_tests_base="$BACKEND_ROOT/$area/$module/${module}.Tests"

  for test_type in $TEST_TYPE_ORDER; do
    local suffix="${TEST_TYPE_SUFFIX[$test_type]}"
    local label="${TEST_TYPE_LABEL[$test_type]}"
    local guidance="${TEST_TYPE_GUIDANCE[$test_type]//__CLASS__/$class_name}"
    local test_class="${class_name}${suffix}"

    # Resolve subfolder and C# namespace from test_type + kind.
    local subdir namespace
    case "$test_type" in
      Unit)
        case "$kind" in
          handler)   subdir="Unit/Application";   namespace="${module}.Tests.Unit.Application" ;;
          validator) subdir="Unit/Validators";     namespace="${module}.Tests.Unit.Validators" ;;
          *)         subdir="Unit/Domain/${kind}"; namespace="${module}.Tests.Unit.Domain.${kind}" ;;
        esac
        ;;
      Integration)
        case "$kind" in
          handler|validator) subdir="Integration/Endpoints";   namespace="${module}.Tests.Integration" ;;
          *)                 subdir="Integration/Persistence"; namespace="${module}.Tests.Integration" ;;
        esac
        ;;
      EndToEnd)   subdir="Integration/Endpoints"; namespace="${module}.Tests.Integration" ;;
      Regression) subdir="Regression";            namespace="${module}.Tests.Regression" ;;
      Security)   subdir="Security";              namespace="${module}.Tests.Security" ;;
    esac

    local test_file="$module_tests_base/$subdir/${test_class}.cs"

    {
      echo "// Test Type: ${label}"
      echo "//"
      echo "// Source References:"
      for ref in "${refs[@]}"; do
        echo "// $ref"
      done
      echo ""
      echo "namespace ${namespace};"
      echo ""
      echo "public class ${test_class}"
      echo "{"
      echo "    // ${guidance}"
      echo "}"
    } | safe_write_file "$test_file"
  done
}

# ---------------------------------------------------------------------------
# process_source_file AREA MODULE SOURCE_FILE KIND
#   KIND is the domain category ("Aggregates", "ValueObjects", etc.) or
#   "validator" for FluentValidation files. Handlers are processed directly
#   in process_module using extract_handler_name.
# ---------------------------------------------------------------------------
process_source_file() {
  local area="$1" module="$2" source_file="$3" kind="${4:-}"
  is_interface_only "$source_file" && return

  local class_name
  class_name="$(extract_type_name "$source_file")"
  [[ -z "$class_name" ]] && return

  local module_root="$BACKEND_ROOT/$area/$module"
  local refs
  mapfile -t refs < <(find_source_references "$module_root" "$module" "$class_name" "$source_file")

  generate_test_module "$area" "$module" "$class_name" "$kind" "${refs[@]}"
}

process_module() {
  local area="$1" module="$2"
  local module_root="$BACKEND_ROOT/$area/$module"

  if [[ ! -d "$module_root" ]]; then
    echo "skip (module folder not found yet): $area/$module"
    return
  fi

  echo "== $area/$module =="
  ensure_test_csproj "$area" "$module"

  local domain_root="$module_root/${module}.Domain"
  for category in $DOMAIN_CATEGORIES; do
    local category_dir="$domain_root/$category"
    [[ -d "$category_dir" ]] || continue
    while IFS= read -r -d '' source_file; do
      # Pass the domain category (e.g. Aggregates) as the KIND so the test
      # file lands in Unit/Domain/{category}/ with the correct namespace.
      process_source_file "$area" "$module" "$source_file" "$category"
    done < <(find "$category_dir" -type f -name '*.cs' -print0)
  done

  local features_dir="$module_root/${module}.Application/Features"
  if [[ -d "$features_dir" ]]; then
    # 1. Dedicated *Handler.cs files (handler in its own file).
    while IFS= read -r -d '' source_file; do
      process_source_file "$area" "$module" "$source_file" "handler"
    done < <(find "$features_dir" -type f -name '*Handler.cs' -print0)

    # 2. Combined *Command.cs / *Query.cs files that contain an embedded Handler
    #    class (the dominant pattern in this codebase). We extract the handler
    #    class name specifically — not the command/query record — so the generated
    #    test file is named after the handler, not the data shape.
    while IFS= read -r -d '' source_file; do
      local handler_name
      handler_name="$(extract_handler_name "$source_file")"
      [[ -z "$handler_name" ]] && continue
      is_interface_only "$source_file" && continue

      local module_root_inner="$BACKEND_ROOT/$area/$module"
      local refs
      mapfile -t refs < <(find_source_references "$module_root_inner" "$module" "$handler_name" "$source_file")
      generate_test_module "$area" "$module" "$handler_name" "handler" "${refs[@]}"
    done < <(find "$features_dir" -type f \( -name '*Command.cs' -o -name '*Query.cs' \) -print0)

    # 3. Validator files.
    while IFS= read -r -d '' source_file; do
      process_source_file "$area" "$module" "$source_file" "validator"
    done < <(find "$features_dir" -type f -name '*Validator.cs' -print0)
  fi
}

# ---------------------------------------------------------------------------
# ensure_test_csproj AREA MODULE
#   Creates {Module}.Tests.csproj co-located inside the module only if it
#   does not already exist. Matches the Payroll.Tests / HumanResources.Tests
#   pattern already established in this repository.
# ---------------------------------------------------------------------------
ensure_test_csproj() {
  local area="$1" module="$2"
  local base="$BACKEND_ROOT/$area/$module/${module}.Tests"
  local csproj="$base/${module}.Tests.csproj"

  safe_write_file "$csproj" <<CSPROJ
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <IsPackable>false</IsPackable>
    <Nullable>enable</Nullable>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="xunit" Version="2.9.0" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.8.2" />
    <PackageReference Include="FluentAssertions" Version="6.12.0" />
    <PackageReference Include="NSubstitute" Version="5.1.0" />
    <PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="9.0.0" />
    <PackageReference Include="Testcontainers.PostgreSql" Version="3.10.0" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.11.1" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="../${module}.Application/${module}.Application.csproj" />
    <ProjectReference Include="../${module}.Domain/${module}.Domain.csproj" />
    <ProjectReference Include="../${module}.Infrastructure/${module}.Infrastructure.csproj" />
  </ItemGroup>
</Project>
CSPROJ
}

for area in "${!MODULES[@]}"; do
  for module in ${MODULES[$area]}; do
    process_module "$area" "$module"
  done
done

echo ""
echo "=================================================="
echo "Traceable test-scaffold generation complete."
echo "Discovered target files : $DISCOVERED_COUNT"
echo "Created test files      : $CREATED_COUNT"
echo "Skipped (already exist) : $SKIPPED_COUNT"
echo "=================================================="
echo "Nothing was deleted, overwritten, or moved. Existing files are untouched."
echo "Every generated file carries dynamically resolved Source References."
echo "Fill in real Unit/Integration/EndToEnd/Regression/Security scenarios"
echo "based on the referenced production files' actual behavior."
