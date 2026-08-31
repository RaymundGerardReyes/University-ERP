#!/usr/bin/env bash
# generate-unit-test-templates.sh
#
# Discovery-based unit-test template generator for University-ERP-Backend.
#
# WHAT THIS DOES DIFFERENTLY FROM THE OLD SCRIPT:
#   - It does NOT invent generic names like PLACEHOLDER_AuthorizationTests.cs.
#   - It reads the actual production .cs files (Domain/Aggregates, Domain/Entities,
#     Domain/ValueObjects, Domain/Events, Domain/Policies, Domain/DomainServices,
#     Domain/Exceptions, and Application/Features handlers/validators) and extracts
#     the real class/record name with a regex, then names the generated test file
#     and test class after that real name.
#   - It NEVER overwrites, replaces, or deletes an existing file. Every write goes
#     through safe_write_file(), which checks for existence first and skips if found.
#   - It is safe to re-run as many times as you want (idempotent): re-running only
#     fills in gaps for newly added production classes, it never touches what
#     already exists.
#   - Adding a new module requires zero code changes here — just add its name to
#     the MODULES map. The class discovery is generic, not special-cased.
#
# WHAT THIS SCRIPT DOES NOT DO (by design, per current scope):
#   - It does not implement real test logic/assertions. Generated methods contain
#     Arrange/Act/Assert stubs only, ready for you to fill in.
#   - It does not touch, move, or delete any existing production or test file.

set -Eeuo pipefail

BACKEND_ROOT="University-ERP-Backend/src/Modules"

declare -A MODULES
MODULES["Academic"]="AcademicScheduling Assessments Curriculum Enrollment Examination LearningManagement Registrar StudentInformation Teaching"
MODULES["Administration"]="AssetManagement Facilities Finance HumanResources Inventory Library MessCanteen Payroll Procurement Transport"
MODULES["Governance"]="EventManagement GrievanceManagement Helpdesk QualityAccreditation VisitorManagement"
MODULES["Platform"]="AnalyticsBI CRM Communication DocumentManagement IdentityAccess MultiCampus Notification"
MODULES["StudentLifecycle"]="Admissions Alumni GuidanceCounseling HealthCenter Hostel PlacementCareer"

# Domain sub-folders to scan per module. Add more categories here if your
# modules introduce new Domain sub-folders later — no other change needed.
DOMAIN_CATEGORIES="Aggregates Entities ValueObjects Events Policies DomainServices Exceptions"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "Running in --dry-run mode: no files will be written."
fi

CREATED_COUNT=0
SKIPPED_COUNT=0
DISCOVERED_COUNT=0

# ---------------------------------------------------------------------------
# extract_type_name FILE
#   Prints the first public class/record/record class/record struct identifier
#   declared in FILE. Prints nothing if the file only declares an interface,
#   enum, or has no public type (in which case the caller should skip it).
# ---------------------------------------------------------------------------
extract_type_name() {
  local file="$1"
  grep -Eo '\bpublic[[:space:]]+(sealed[[:space:]]+|abstract[[:space:]]+|static[[:space:]]+|partial[[:space:]]+)*(class|record[[:space:]]+class|record[[:space:]]+struct|record)[[:space:]]+[A-Za-z0-9_]+' "$file" \
    | head -n1 \
    | awk '{print $NF}'
}

is_interface_only() {
  local file="$1"
  grep -Eq '\bpublic[[:space:]]+interface[[:space:]]' "$file"
}

# ---------------------------------------------------------------------------
# safe_write_file TARGET_PATH
#   Reads heredoc content from stdin and writes it to TARGET_PATH ONLY if
#   TARGET_PATH does not already exist. This is the single choke point that
#   guarantees no existing file (production or previously generated test) is
#   ever overwritten by this script.
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
# generate_domain_test AREA MODULE CATEGORY SOURCE_FILE
#   Produces Unit/Domain/<Category>/<ClassName>Tests.cs for one discovered
#   Domain type. Test method names are derived generically (create / reject
#   invalid state / raise domain event) so the template is meaningful without
#   hardcoding business rules per class.
# ---------------------------------------------------------------------------
generate_domain_test() {
  local area="$1" module="$2" category="$3" source_file="$4"
  is_interface_only "$source_file" && return

  local class_name
  class_name="$(extract_type_name "$source_file")"
  [[ -z "$class_name" ]] && return

  local test_dir="$BACKEND_ROOT/$area/$module/${module}.Tests/Unit/Domain/$category"
  local test_file="$test_dir/${class_name}Tests.cs"

  safe_write_file "$test_file" <<CSFILE
namespace ${module}.Tests.Unit.Domain.${category};

using ${module}.Domain.${category};
using FluentAssertions;
using Xunit;

// Source under test: ${module}.Domain/${category}/$(basename "$source_file")
public class ${class_name}Tests
{
    [Fact]
    public void Should_Create_Valid_${class_name}()
    {
        // Arrange

        // Act

        // Assert
    }

    [Fact]
    public void Should_Reject_Invalid_${class_name}_State()
    {
        // Arrange

        // Act

        // Assert
    }

    [Fact]
    public void Should_Raise_Expected_DomainEvent_When_State_Changes()
    {
        // Arrange

        // Act

        // Assert
    }
}
CSFILE
}

# ---------------------------------------------------------------------------
# generate_application_test AREA MODULE KIND SOURCE_FILE
#   KIND is either "Handler" or "Validator". Produces the corresponding test
#   file under Unit/Application or Unit/Validators, named after the real
#   handler/validator class discovered in the file.
# ---------------------------------------------------------------------------
generate_application_test() {
  local area="$1" module="$2" kind="$3" source_file="$4"
  is_interface_only "$source_file" && return

  local class_name
  class_name="$(extract_type_name "$source_file")"
  [[ -z "$class_name" ]] && return

  local subfolder test_dir test_file
  if [[ "$kind" == "Validator" ]]; then
    subfolder="Validators"
  else
    subfolder="Application"
  fi
  test_dir="$BACKEND_ROOT/$area/$module/${module}.Tests/Unit/$subfolder"
  test_file="$test_dir/${class_name}Tests.cs"

  safe_write_file "$test_file" <<CSFILE
namespace ${module}.Tests.Unit.${subfolder};

using FluentAssertions;
using NSubstitute;
using Xunit;

// Source under test: $source_file
public class ${class_name}Tests
{
    [Fact]
    public void Should_Succeed_With_Valid_Input()
    {
        // Arrange

        // Act

        // Assert
    }

    [Fact]
    public void Should_Fail_With_Invalid_Input()
    {
        // Arrange

        // Act

        // Assert
    }
}
CSFILE
}

# ---------------------------------------------------------------------------
# ensure_test_csproj AREA MODULE
#   Creates the .Tests.csproj only if it does not already exist. Existing
#   csproj files (and any manual edits to them) are left untouched.
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

# ---------------------------------------------------------------------------
# process_module AREA MODULE
#   Orchestrates discovery + generation for one module. Every step is
#   read-only against production code (grep only) and additive against the
#   test tree (safe_write_file only).
# ---------------------------------------------------------------------------
process_module() {
  local area="$1" module="$2"
  local module_root="$BACKEND_ROOT/$area/$module"

  if [[ ! -d "$module_root" ]]; then
    echo "skip (module folder not found yet): $area/$module"
    return
  fi

  echo "== $area/$module =="
  ensure_test_csproj "$area" "$module"

  # Domain layer discovery: scan each known category folder if it exists.
  local domain_root="$module_root/${module}.Domain"
  for category in $DOMAIN_CATEGORIES; do
    local category_dir="$domain_root/$category"
    [[ -d "$category_dir" ]] || continue
    while IFS= read -r -d '' source_file; do
      generate_domain_test "$area" "$module" "$category" "$source_file"
    done < <(find "$category_dir" -type f -name '*.cs' -print0)
  done

  # Application layer discovery: only Handler and Validator files carry
  # testable logic; plain Command/Query records are data shapes, not units.
  local features_dir="$module_root/${module}.Application/Features"
  if [[ -d "$features_dir" ]]; then
    while IFS= read -r -d '' source_file; do
      generate_application_test "$area" "$module" "Handler" "$source_file"
    done < <(find "$features_dir" -type f -name '*Handler.cs' -print0)

    while IFS= read -r -d '' source_file; do
      generate_application_test "$area" "$module" "Validator" "$source_file"
    done < <(find "$features_dir" -type f -name '*Validator.cs' -print0)
  fi
}

for area in "${!MODULES[@]}"; do
  for module in ${MODULES[$area]}; do
    process_module "$area" "$module"
  done
done

echo ""
echo "=============================================="
echo "Discovery-based unit-test generation complete."
echo "Discovered target files : $DISCOVERED_COUNT"
echo "Created test files      : $CREATED_COUNT"
echo "Skipped (already exist) : $SKIPPED_COUNT"
echo "=============================================="
echo "Nothing was deleted, overwritten, or moved. Existing tests are untouched."
echo "Next: open each generated *Tests.cs and replace the Arrange/Act/Assert stubs"
echo "with real assertions against the corresponding production class."