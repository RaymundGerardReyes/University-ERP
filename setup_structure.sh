#!/bin/bash
set -euo pipefail

if [ -z "${BASH_VERSION:-}" ]; then
  echo "ERROR: this script must be run with bash (bash scaffold.sh), not sh." >&2
  exit 1
fi

echo "Starting scaffolding for University ERP DBMA..."

ROOT_DIR="$(pwd)"
SOLUTION_NAME="UniversityErp"

ensure_dir() {
  mkdir -p "$1"
  if [ -z "$(find "$1" -maxdepth 1 -mindepth 1)" ]; then
    touch "$1/.gitkeep"
  fi
}

ensure_file() {
  [ -f "$1" ] || touch "$1"
}

new_classlib() {
  local proj_dir=$1
  local proj_name=$(basename "$proj_dir")
  if [ ! -f "$proj_dir/$proj_name.csproj" ]; then
    dotnet new classlib -n "$proj_name" -o "$proj_dir" --force >/dev/null
    rm -f "$proj_dir/Class1.cs"
  fi
}

# ------------------------------------------------------------------------------
# 0. Solution root
# ------------------------------------------------------------------------------
if [ ! -f "$SOLUTION_NAME.sln" ]; then
  dotnet new sln -n "$SOLUTION_NAME"
fi

cat > .gitignore <<'EOF'
bin/
obj/
*.user
appsettings.Development.json
.vs/
EOF

# ------------------------------------------------------------------------------
# 1. domain/ - Business Knowledge as a First-Class Artifact
# ------------------------------------------------------------------------------
echo "Creating domain/..."
ensure_dir domain/model
ensure_dir domain/adr
ensure_dir domain/runbooks/incident-response
ensure_dir domain/runbooks/module-onboarding
ensure_dir domain/runbooks/data-recovery

for f in business-capability-map ubiquitous-language-glossary bounded-context-catalog \
         context-map aggregate-catalog entity-catalog value-object-catalog \
         domain-event-catalog business-rules-catalog; do
  ensure_file "domain/model/$f.md"
done

for f in ADR-001-modular-monolith-over-microservices \
         ADR-002-shared-kernel-scope-restriction \
         ADR-003-anti-corruption-layer-health-guidance \
         ADR-004-event-driven-cross-module-integration \
         ADR-NNN-template; do
  ensure_file "domain/adr/$f.md"
done

ensure_file domain/runbooks/incident-response/finance-invoice-outbox-stuck.md
ensure_file domain/runbooks/incident-response/identityaccess-outage.md
ensure_file domain/runbooks/incident-response/grievance-sla-breach-storm.md
ensure_file domain/runbooks/module-onboarding/new-bounded-context-checklist.md
ensure_file domain/runbooks/data-recovery/student-enrollment-rollback.md

# ------------------------------------------------------------------------------
# 2. src/Bootstrap/ - Composition Roots
# ------------------------------------------------------------------------------
echo "Creating src/Bootstrap/..."

new_classlib src/Bootstrap/UniversityErp.Api  # replaced below with webapi
rm -rf src/Bootstrap/UniversityErp.Api
dotnet new webapi -n UniversityErp.Api -o src/Bootstrap/UniversityErp.Api --force >/dev/null

ensure_dir src/Bootstrap/UniversityErp.Api/ModuleRegistration
ensure_dir src/Bootstrap/UniversityErp.Api/Middleware
ensure_dir src/Bootstrap/UniversityErp.Api/appsettings

CLUSTERS="Academic StudentLifecycle Administration Governance Platform"
for cluster in $CLUSTERS; do
  file="src/Bootstrap/UniversityErp.Api/ModuleRegistration/${cluster}ModulesRegistration.cs"
  if [ ! -f "$file" ]; then
    cat > "$file" <<EOF
namespace UniversityErp.Api.ModuleRegistration;

// Aggregates module self-registration calls for the $cluster cluster.
// Each module below must expose Add<ModuleName>Module(IServiceCollection) in its own ModuleRegistration.cs.
public static class ${cluster}ModulesRegistration
{
    public static IServiceCollection Add${cluster}Modules(this IServiceCollection services)
    {
        // TODO: services.AddXxxModule();
        return services;
    }
}
EOF
  fi
done

for f in CorrelationIdMiddleware GlobalExceptionMiddleware AuthorizationDelegationMiddleware; do
  ensure_file "src/Bootstrap/UniversityErp.Api/Middleware/$f.cs"
done
ensure_file src/Bootstrap/UniversityErp.Api/appsettings/appsettings.Production.json

dotnet new worker -n UniversityErp.Worker -o src/Bootstrap/UniversityErp.Worker --force >/dev/null
ensure_dir src/Bootstrap/UniversityErp.Worker/Consumers
ensure_dir src/Bootstrap/UniversityErp.Worker/ScheduledJobs
for f in AcademicEventConsumers FinanceEventConsumers GovernanceEventConsumers; do
  ensure_file "src/Bootstrap/UniversityErp.Worker/Consumers/$f.cs"
done
for f in TermStartBatchInvoicingJob PayrollMonthlyBatchJob SlaBreachScannerJob WaitlistPromotionJob; do
  ensure_file "src/Bootstrap/UniversityErp.Worker/ScheduledJobs/$f.cs"
done

new_classlib src/Bootstrap/UniversityErp.Migrator
ensure_dir src/Bootstrap/UniversityErp.Migrator/MigrationRunners
ensure_file src/Bootstrap/UniversityErp.Migrator/MigrationRunners/PerModuleMigrationRunner.cs

# ------------------------------------------------------------------------------
# 3. src/SharedKernel/ - Deliberately Small, Deliberately Boring
# ------------------------------------------------------------------------------
echo "Creating src/SharedKernel/..."
for proj in SharedKernel.Domain SharedKernel.Application SharedKernel.Infrastructure SharedKernel.Observability; do
  new_classlib "src/SharedKernel/$proj"
done

for sub in Primitives ValueObjects Identifiers Audit; do
  ensure_dir "src/SharedKernel/SharedKernel.Domain/$sub"
done
for sub in Abstractions Behaviors Pagination Results; do
  ensure_dir "src/SharedKernel/SharedKernel.Application/$sub"
done
for sub in Outbox Inbox Persistence Messaging; do
  ensure_dir "src/SharedKernel/SharedKernel.Infrastructure/$sub"
done
for sub in Logging Tracing Metrics HealthChecks; do
  ensure_dir "src/SharedKernel/SharedKernel.Observability/$sub"
done

# ------------------------------------------------------------------------------
# 4. src/Modules/ - The Bounded Contexts
# ------------------------------------------------------------------------------
echo "Creating src/Modules/..."

create_module_structure() {
    local cluster=$1
    local context=$2
    local base_path="src/Modules/$cluster/$context"

    new_classlib "$base_path/$context.Domain"
    for sub in Aggregates Entities ValueObjects DomainEvents DomainServices Policies Exceptions; do
        ensure_dir "$base_path/$context.Domain/$sub"
    done

    new_classlib "$base_path/$context.Application"
    ensure_dir "$base_path/$context.Application/Abstractions"
    ensure_dir "$base_path/$context.Application/Features"
    ensure_dir "$base_path/$context.Application/Mappings"
    ensure_dir "$base_path/$context.Application/EventHandlers/DomainEventHandlers"
    ensure_dir "$base_path/$context.Application/EventHandlers/IntegrationEventHandlers"
    if [ ! -f "$base_path/$context.Application/ModuleRegistration.cs" ]; then
      cat > "$base_path/$context.Application/ModuleRegistration.cs" <<EOF
namespace $context.Application;

public static class ModuleRegistration
{
    public static IServiceCollection Add${context}Module(this IServiceCollection services)
    {
        // TODO: register handlers, repositories, event subscriptions for $context
        return services;
    }
}
EOF
    fi

    new_classlib "$base_path/$context.Infrastructure"
    for sub in Persistence Repositories Outbox Inbox ExternalAdapters Observability; do
        ensure_dir "$base_path/$context.Infrastructure/$sub"
    done

    new_classlib "$base_path/$context.Presentation"
    for sub in Endpoints Contracts Filters OpenApi; do
        ensure_dir "$base_path/$context.Presentation/$sub"
    done

    new_classlib "$base_path/$context.Contracts"
    ensure_dir "$base_path/$context.Contracts/PublicApi"
    ensure_dir "$base_path/$context.Contracts/IntegrationEvents"

    for testProj in Tests.Unit Tests.Integration Tests.Architecture; do
        if [ ! -f "$base_path/$context.$testProj/$context.$testProj.csproj" ]; then
            dotnet new xunit -n "$context.$testProj" -o "$base_path/$context.$testProj" --force >/dev/null
        fi
    done

    for proj in Domain Application Infrastructure Presentation Contracts Tests.Unit Tests.Integration Tests.Architecture; do
        dotnet sln "$SOLUTION_NAME.sln" add "$base_path/$context.$proj/$context.$proj.csproj" >/dev/null
    done
}

declare -A CLUSTER_CONTEXTS=(
  [Academic]="StudentInformation Registrar Examination LearningManagement AcademicScheduling"
  [StudentLifecycle]="Admissions Hostel HealthCenter GuidanceCounseling PlacementCareer Alumni"
  [Administration]="Finance HumanResources Payroll Procurement Inventory AssetManagement Library Transport MessCanteen Facilities"
  [Governance]="GrievanceManagement Helpdesk EventManagement VisitorManagement QualityAccreditation"
  [Platform]="IdentityAccess Notification Communication DocumentManagement AnalyticsBI CRM MultiCampus"
)

for cluster in "${!CLUSTER_CONTEXTS[@]}"; do
  for ctx in ${CLUSTER_CONTEXTS[$cluster]}; do
    create_module_structure "$cluster" "$ctx"
  done
done

# ------------------------------------------------------------------------------
# 5. src/Contracts/ - The Only Legal Cross-Module Surface
# ------------------------------------------------------------------------------
echo "Creating src/Contracts/..."
new_classlib src/Contracts/PublicApiContracts
new_classlib src/Contracts/IntegrationEvents

for cluster in Academic StudentLifecycle Administration Governance Platform; do
  ensure_dir "src/Contracts/PublicApiContracts/$cluster"
  ensure_dir "src/Contracts/IntegrationEvents/$cluster"
done

ensure_file src/Contracts/PublicApiContracts/Academic/Registrar.CurriculumApi.cs
ensure_file src/Contracts/PublicApiContracts/Academic/Examination.ResultQueryApi.cs
ensure_file src/Contracts/PublicApiContracts/StudentLifecycle/StudentInformation.StudentReadModel.cs
ensure_file src/Contracts/PublicApiContracts/Administration/Finance.BillingApi.cs
ensure_file src/Contracts/PublicApiContracts/Governance/Facilities.SpaceAvailabilityApi.cs
ensure_file src/Contracts/PublicApiContracts/Platform/IdentityAccess.AuthorizationApi.cs

ensure_file src/Contracts/IntegrationEvents/Academic/StudentEnrolledIntegrationEvent.cs
ensure_file src/Contracts/IntegrationEvents/Academic/ExamResultPublishedIntegrationEvent.cs
ensure_file src/Contracts/IntegrationEvents/StudentLifecycle/ApplicantAcceptedIntegrationEvent.cs
ensure_file src/Contracts/IntegrationEvents/StudentLifecycle/RoomAllocatedIntegrationEvent.cs
ensure_file src/Contracts/IntegrationEvents/Administration/InvoiceIssuedIntegrationEvent.cs
ensure_file src/Contracts/IntegrationEvents/Administration/PayrollCalculatedIntegrationEvent.cs
ensure_file src/Contracts/IntegrationEvents/Governance/GrievanceSubmittedIntegrationEvent.cs
ensure_file src/Contracts/IntegrationEvents/Governance/SupportTicketRequestedIntegrationEvent.cs
ensure_file src/Contracts/IntegrationEvents/Platform/AccountProvisionedIntegrationEvent.cs

# ------------------------------------------------------------------------------
# 6. tests/ - Architectural Guarantees
# ------------------------------------------------------------------------------
echo "Creating tests/..."
for proj in ArchitectureTests ContractTests IntegrationTests EndToEndTests PerformanceTests SecurityTests; do
  if [ ! -f "tests/$proj/$proj.csproj" ]; then
    dotnet new xunit -n "$proj" -o "tests/$proj" --force >/dev/null
    dotnet sln "$SOLUTION_NAME.sln" add "tests/$proj/$proj.csproj" >/dev/null
  fi
done

for ctx in StudentInformation Finance Hostel GrievanceManagement; do
  ensure_dir "tests/DomainTests/$ctx"
done
ensure_dir tests/ContractTests/PublicApiContracts
ensure_dir tests/ContractTests/IntegrationEvents

ensure_file tests/ArchitectureTests/SharedKernelPurityTests.cs
ensure_file tests/ArchitectureTests/NoCrossModuleDomainReferenceTests.cs
ensure_file tests/ArchitectureTests/ContractOnlyDependencyTests.cs
ensure_file tests/ArchitectureTests/ModuleRegistrationConventionTests.cs

ensure_file tests/DomainTests/StudentInformation/EnrollmentInvariantTests.cs
ensure_file tests/DomainTests/Finance/InvoiceBalancingTests.cs
ensure_file tests/DomainTests/Hostel/RoomCapacityInvariantTests.cs
ensure_file tests/DomainTests/GrievanceManagement/EscalationChainTests.cs

ensure_file tests/EndToEndTests/AdmissionToEnrollmentFlow.cs
ensure_file tests/EndToEndTests/HostelAllocationToBillingFlow.cs
ensure_file tests/EndToEndTests/GrievanceToFacilitiesFlow.cs

ensure_file tests/PerformanceTests/RegistrationPeakLoad.cs
ensure_file tests/PerformanceTests/PayrollBatchCalculation.cs
ensure_file tests/PerformanceTests/InvoiceIssuanceThroughput.cs

ensure_file tests/SecurityTests/AuthorizationPolicyTests.cs
ensure_file tests/SecurityTests/DataClassificationLeakTests.cs

# ------------------------------------------------------------------------------
# 7. ops/ - Operational Mirror
# ------------------------------------------------------------------------------
echo "Creating ops/..."
ALL_MODULES="StudentInformation Registrar Examination LearningManagement AcademicScheduling \
Admissions Hostel HealthCenter GuidanceCounseling PlacementCareer Alumni \
Finance HumanResources Payroll Procurement Inventory AssetManagement Library Transport MessCanteen Facilities \
GrievanceManagement Helpdesk EventManagement VisitorManagement QualityAccreditation \
IdentityAccess Notification Communication DocumentManagement AnalyticsBI CRM MultiCampus"

for ctx in $ALL_MODULES; do
  ensure_dir "ops/db-migrations/$ctx"
done

ensure_dir ops/observability/dashboards
ensure_dir ops/observability/alert-rules
ensure_file ops/observability/dashboards/academic-cluster-dashboard.json
ensure_file ops/observability/dashboards/finance-cluster-dashboard.json
ensure_file ops/observability/dashboards/governance-cluster-dashboard.json
ensure_file ops/observability/alert-rules/finance-invoice-failure-rate.yaml
ensure_file ops/observability/alert-rules/grievance-sla-breach.yaml
ensure_file ops/observability/alert-rules/identityaccess-auth-latency.yaml

ensure_dir ops/pipelines/module-build
ensure_dir ops/pipelines/module-test
ensure_dir ops/pipelines/module-release
ensure_file ops/pipelines/module-build/academic-modules.pipeline.yaml
ensure_file ops/pipelines/module-build/administration-modules.pipeline.yaml
ensure_file ops/pipelines/module-build/platform-modules.pipeline.yaml
ensure_file ops/pipelines/module-test/per-module-test.pipeline.yaml
ensure_file ops/pipelines/module-release/selective-release.pipeline.yaml

# ------------------------------------------------------------------------------
# 8. Root documentation
# ------------------------------------------------------------------------------
if [ ! -f README.md ]; then
cat > README.md <<'EOF'
# University ERP Backend

Domain-Based Modular Architecture (DBMA) monolith. See `domain/model/` for the
business model, `domain/adr/` for architectural decision records, and
`src/Modules/<Cluster>/<Context>/` for bounded-context code. Only `*.Contracts`
projects may be referenced across modules.
EOF
fi

echo "=============================================================================="
echo "Scaffolding Complete!"
echo "=============================================================================="
