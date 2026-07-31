$ErrorActionPreference = "Stop"

Write-Host "Starting scaffolding for University ERP DBMA..."

$SOLUTION_NAME = "UniversityErp"

function Ensure-Dir {
    param([string]$path)
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Force -Path $path | Out-Null
    }
    
    $filesCount = (Get-ChildItem $path -Force | Measure-Object).Count
    if ($filesCount -eq 0) {
        New-Item -ItemType File -Force -Path "$path/.gitkeep" | Out-Null
    }
}

function Ensure-File {
    param([string]$path)
    if (-not (Test-Path $path)) {
        $dir = Split-Path $path
        if (-not (Test-Path $dir) -and $dir -ne "") {
            New-Item -ItemType Directory -Force -Path $dir | Out-Null
        }
        New-Item -ItemType File -Force -Path $path | Out-Null
    }
}

function New-Classlib {
    param([string]$projDir)
    $projName = Split-Path $projDir -Leaf
    if (-not (Test-Path "$projDir/$projName.csproj")) {
        dotnet new classlib -n $projName -o $projDir --force | Out-Null
        if (Test-Path "$projDir/Class1.cs") {
            Remove-Item "$projDir/Class1.cs" -Force
        }
    }
}

# ------------------------------------------------------------------------------
# 0. Solution root
# ------------------------------------------------------------------------------
if (-not (Test-Path "$SOLUTION_NAME.sln")) {
    dotnet new sln -n $SOLUTION_NAME | Out-Null
}

$gitignoreContent = @"
bin/
obj/
*.user
appsettings.Development.json
.vs/
"@
if (-not (Test-Path ".gitignore")) {
    Set-Content -Path ".gitignore" -Value $gitignoreContent
}

# ------------------------------------------------------------------------------
# 1. domain/ - Business Knowledge as a First-Class Artifact
# ------------------------------------------------------------------------------
Write-Host "Creating domain/..."
Ensure-Dir "domain/model"
Ensure-Dir "domain/adr"
Ensure-Dir "domain/runbooks/incident-response"
Ensure-Dir "domain/runbooks/module-onboarding"
Ensure-Dir "domain/runbooks/data-recovery"

$modelFiles = @("business-capability-map", "ubiquitous-language-glossary", "bounded-context-catalog", "context-map", "aggregate-catalog", "entity-catalog", "value-object-catalog", "domain-event-catalog", "business-rules-catalog")
foreach ($f in $modelFiles) { Ensure-File "domain/model/$f.md" }

$adrFiles = @("ADR-001-modular-monolith-over-microservices", "ADR-002-shared-kernel-scope-restriction", "ADR-003-anti-corruption-layer-health-guidance", "ADR-004-event-driven-cross-module-integration", "ADR-NNN-template")
foreach ($f in $adrFiles) { Ensure-File "domain/adr/$f.md" }

Ensure-File "domain/runbooks/incident-response/finance-invoice-outbox-stuck.md"
Ensure-File "domain/runbooks/incident-response/identityaccess-outage.md"
Ensure-File "domain/runbooks/incident-response/grievance-sla-breach-storm.md"
Ensure-File "domain/runbooks/module-onboarding/new-bounded-context-checklist.md"
Ensure-File "domain/runbooks/data-recovery/student-enrollment-rollback.md"

# ------------------------------------------------------------------------------
# 2. src/Bootstrap/ - Composition Roots
# ------------------------------------------------------------------------------
Write-Host "Creating src/Bootstrap/..."

if (-not (Test-Path "src/Bootstrap/UniversityErp.Api/UniversityErp.Api.csproj")) {
    dotnet new webapi -n UniversityErp.Api -o "src/Bootstrap/UniversityErp.Api" --force | Out-Null
}

Ensure-Dir "src/Bootstrap/UniversityErp.Api/ModuleRegistration"
Ensure-Dir "src/Bootstrap/UniversityErp.Api/Middleware"
Ensure-Dir "src/Bootstrap/UniversityErp.Api/appsettings"

$clusters = @("Academic", "StudentLifecycle", "Administration", "Governance", "Platform")
foreach ($cluster in $clusters) {
    $file = "src/Bootstrap/UniversityErp.Api/ModuleRegistration/${cluster}ModulesRegistration.cs"
    if (-not (Test-Path $file)) {
        $registrationContent = @"
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
"@
        Set-Content -Path $file -Value $registrationContent
    }
}

$apiMiddlewares = @("CorrelationIdMiddleware", "GlobalExceptionMiddleware", "AuthorizationDelegationMiddleware")
foreach ($f in $apiMiddlewares) { Ensure-File "src/Bootstrap/UniversityErp.Api/Middleware/$f.cs" }
Ensure-File "src/Bootstrap/UniversityErp.Api/appsettings/appsettings.Production.json"

if (-not (Test-Path "src/Bootstrap/UniversityErp.Worker/UniversityErp.Worker.csproj")) {
    dotnet new worker -n UniversityErp.Worker -o "src/Bootstrap/UniversityErp.Worker" --force | Out-Null
}
Ensure-Dir "src/Bootstrap/UniversityErp.Worker/Consumers"
Ensure-Dir "src/Bootstrap/UniversityErp.Worker/ScheduledJobs"
$workerConsumers = @("AcademicEventConsumers", "FinanceEventConsumers", "GovernanceEventConsumers")
foreach ($f in $workerConsumers) { Ensure-File "src/Bootstrap/UniversityErp.Worker/Consumers/$f.cs" }
$workerJobs = @("TermStartBatchInvoicingJob", "PayrollMonthlyBatchJob", "SlaBreachScannerJob", "WaitlistPromotionJob")
foreach ($f in $workerJobs) { Ensure-File "src/Bootstrap/UniversityErp.Worker/ScheduledJobs/$f.cs" }

New-Classlib "src/Bootstrap/UniversityErp.Migrator"
Ensure-Dir "src/Bootstrap/UniversityErp.Migrator/MigrationRunners"
Ensure-File "src/Bootstrap/UniversityErp.Migrator/MigrationRunners/PerModuleMigrationRunner.cs"

# ------------------------------------------------------------------------------
# 3. src/SharedKernel/ - Deliberately Small, Deliberately Boring
# ------------------------------------------------------------------------------
Write-Host "Creating src/SharedKernel/..."
$kernelProjs = @("SharedKernel.Domain", "SharedKernel.Application", "SharedKernel.Infrastructure", "SharedKernel.Observability")
foreach ($proj in $kernelProjs) { New-Classlib "src/SharedKernel/$proj" }

$kernelDomainSubs = @("Primitives", "ValueObjects", "Identifiers", "Audit")
foreach ($sub in $kernelDomainSubs) { Ensure-Dir "src/SharedKernel/SharedKernel.Domain/$sub" }
$kernelAppSubs = @("Abstractions", "Behaviors", "Pagination", "Results")
foreach ($sub in $kernelAppSubs) { Ensure-Dir "src/SharedKernel/SharedKernel.Application/$sub" }
$kernelInfraSubs = @("Outbox", "Inbox", "Persistence", "Messaging")
foreach ($sub in $kernelInfraSubs) { Ensure-Dir "src/SharedKernel/SharedKernel.Infrastructure/$sub" }
$kernelObsSubs = @("Logging", "Tracing", "Metrics", "HealthChecks")
foreach ($sub in $kernelObsSubs) { Ensure-Dir "src/SharedKernel/SharedKernel.Observability/$sub" }

# ------------------------------------------------------------------------------
# 4. src/Modules/ - The Bounded Contexts
# ------------------------------------------------------------------------------
Write-Host "Creating src/Modules/..."

function Create-Module-Structure {
    param([string]$cluster, [string]$context)
    $basePath = "src/Modules/$cluster/$context"

    New-Classlib "$basePath/$context.Domain"
    $domainSubs = @("Aggregates", "Entities", "ValueObjects", "DomainEvents", "DomainServices", "Policies", "Exceptions")
    foreach ($sub in $domainSubs) { Ensure-Dir "$basePath/$context.Domain/$sub" }

    New-Classlib "$basePath/$context.Application"
    Ensure-Dir "$basePath/$context.Application/Abstractions"
    Ensure-Dir "$basePath/$context.Application/Features"
    Ensure-Dir "$basePath/$context.Application/Mappings"
    Ensure-Dir "$basePath/$context.Application/EventHandlers/DomainEventHandlers"
    Ensure-Dir "$basePath/$context.Application/EventHandlers/IntegrationEventHandlers"
    
    $moduleRegFile = "$basePath/$context.Application/ModuleRegistration.cs"
    if (-not (Test-Path $moduleRegFile)) {
        $moduleRegContent = @"
namespace $context.Application;

public static class ModuleRegistration
{
    public static IServiceCollection Add${context}Module(this IServiceCollection services)
    {
        // TODO: register handlers, repositories, event subscriptions for $context
        return services;
    }
}
"@
        Set-Content -Path $moduleRegFile -Value $moduleRegContent
    }

    New-Classlib "$basePath/$context.Infrastructure"
    $infraSubs = @("Persistence", "Repositories", "Outbox", "Inbox", "ExternalAdapters", "Observability")
    foreach ($sub in $infraSubs) { Ensure-Dir "$basePath/$context.Infrastructure/$sub" }

    New-Classlib "$basePath/$context.Presentation"
    $presSubs = @("Endpoints", "Contracts", "Filters", "OpenApi")
    foreach ($sub in $presSubs) { Ensure-Dir "$basePath/$context.Presentation/$sub" }

    New-Classlib "$basePath/$context.Contracts"
    Ensure-Dir "$basePath/$context.Contracts/PublicApi"
    Ensure-Dir "$basePath/$context.Contracts/IntegrationEvents"

    $testProjs = @("Tests.Unit", "Tests.Integration", "Tests.Architecture")
    foreach ($testProj in $testProjs) {
        $projDir = "$basePath/$context.$testProj"
        if (-not (Test-Path "$projDir/$context.$testProj.csproj")) {
            dotnet new xunit -n "$context.$testProj" -o $projDir --force | Out-Null
        }
    }

    $allProjs = @("Domain", "Application", "Infrastructure", "Presentation", "Contracts", "Tests.Unit", "Tests.Integration", "Tests.Architecture")
    foreach ($proj in $allProjs) {
        dotnet sln "$SOLUTION_NAME.sln" add "$basePath/$context.$proj/$context.$proj.csproj" | Out-Null
    }
}

$clusterContexts = @{
    "Academic" = @("StudentInformation", "Registrar", "Examination", "LearningManagement", "AcademicScheduling")
    "StudentLifecycle" = @("Admissions", "Hostel", "HealthCenter", "GuidanceCounseling", "PlacementCareer", "Alumni")
    "Administration" = @("Finance", "HumanResources", "Payroll", "Procurement", "Inventory", "AssetManagement", "Library", "Transport", "MessCanteen", "Facilities")
    "Governance" = @("GrievanceManagement", "Helpdesk", "EventManagement", "VisitorManagement", "QualityAccreditation")
    "Platform" = @("IdentityAccess", "Notification", "Communication", "DocumentManagement", "AnalyticsBI", "CRM", "MultiCampus")
}

foreach ($cluster in $clusterContexts.Keys) {
    foreach ($ctx in $clusterContexts[$cluster]) {
        Create-Module-Structure -cluster $cluster -context $ctx
    }
}

# ------------------------------------------------------------------------------
# 5. src/Contracts/ - The Only Legal Cross-Module Surface
# ------------------------------------------------------------------------------
Write-Host "Creating src/Contracts/..."
New-Classlib "src/Contracts/PublicApiContracts"
New-Classlib "src/Contracts/IntegrationEvents"

foreach ($cluster in $clusters) {
    Ensure-Dir "src/Contracts/PublicApiContracts/$cluster"
    Ensure-Dir "src/Contracts/IntegrationEvents/$cluster"
}

Ensure-File "src/Contracts/PublicApiContracts/Academic/Registrar.CurriculumApi.cs"
Ensure-File "src/Contracts/PublicApiContracts/Academic/Examination.ResultQueryApi.cs"
Ensure-File "src/Contracts/PublicApiContracts/StudentLifecycle/StudentInformation.StudentReadModel.cs"
Ensure-File "src/Contracts/PublicApiContracts/Administration/Finance.BillingApi.cs"
Ensure-File "src/Contracts/PublicApiContracts/Governance/Facilities.SpaceAvailabilityApi.cs"
Ensure-File "src/Contracts/PublicApiContracts/Platform/IdentityAccess.AuthorizationApi.cs"

Ensure-File "src/Contracts/IntegrationEvents/Academic/StudentEnrolledIntegrationEvent.cs"
Ensure-File "src/Contracts/IntegrationEvents/Academic/ExamResultPublishedIntegrationEvent.cs"
Ensure-File "src/Contracts/IntegrationEvents/StudentLifecycle/ApplicantAcceptedIntegrationEvent.cs"
Ensure-File "src/Contracts/IntegrationEvents/StudentLifecycle/RoomAllocatedIntegrationEvent.cs"
Ensure-File "src/Contracts/IntegrationEvents/Administration/InvoiceIssuedIntegrationEvent.cs"
Ensure-File "src/Contracts/IntegrationEvents/Administration/PayrollCalculatedIntegrationEvent.cs"
Ensure-File "src/Contracts/IntegrationEvents/Governance/GrievanceSubmittedIntegrationEvent.cs"
Ensure-File "src/Contracts/IntegrationEvents/Governance/SupportTicketRequestedIntegrationEvent.cs"
Ensure-File "src/Contracts/IntegrationEvents/Platform/AccountProvisionedIntegrationEvent.cs"

# ------------------------------------------------------------------------------
# 6. tests/ - Architectural Guarantees
# ------------------------------------------------------------------------------
Write-Host "Creating tests/..."
$testTypes = @("ArchitectureTests", "ContractTests", "IntegrationTests", "EndToEndTests", "PerformanceTests", "SecurityTests")
foreach ($proj in $testTypes) {
    if (-not (Test-Path "tests/$proj/$proj.csproj")) {
        dotnet new xunit -n $proj -o "tests/$proj" --force | Out-Null
        dotnet sln "$SOLUTION_NAME.sln" add "tests/$proj/$proj.csproj" | Out-Null
    }
}

$domainTestCtxs = @("StudentInformation", "Finance", "Hostel", "GrievanceManagement")
foreach ($ctx in $domainTestCtxs) { Ensure-Dir "tests/DomainTests/$ctx" }
Ensure-Dir "tests/ContractTests/PublicApiContracts"
Ensure-Dir "tests/ContractTests/IntegrationEvents"

Ensure-File "tests/ArchitectureTests/SharedKernelPurityTests.cs"
Ensure-File "tests/ArchitectureTests/NoCrossModuleDomainReferenceTests.cs"
Ensure-File "tests/ArchitectureTests/ContractOnlyDependencyTests.cs"
Ensure-File "tests/ArchitectureTests/ModuleRegistrationConventionTests.cs"

Ensure-File "tests/DomainTests/StudentInformation/EnrollmentInvariantTests.cs"
Ensure-File "tests/DomainTests/Finance/InvoiceBalancingTests.cs"
Ensure-File "tests/DomainTests/Hostel/RoomCapacityInvariantTests.cs"
Ensure-File "tests/DomainTests/GrievanceManagement/EscalationChainTests.cs"

Ensure-File "tests/EndToEndTests/AdmissionToEnrollmentFlow.cs"
Ensure-File "tests/EndToEndTests/HostelAllocationToBillingFlow.cs"
Ensure-File "tests/EndToEndTests/GrievanceToFacilitiesFlow.cs"

Ensure-File "tests/PerformanceTests/RegistrationPeakLoad.cs"
Ensure-File "tests/PerformanceTests/PayrollBatchCalculation.cs"
Ensure-File "tests/PerformanceTests/InvoiceIssuanceThroughput.cs"

Ensure-File "tests/SecurityTests/AuthorizationPolicyTests.cs"
Ensure-File "tests/SecurityTests/DataClassificationLeakTests.cs"

# ------------------------------------------------------------------------------
# 7. ops/ - Operational Mirror
# ------------------------------------------------------------------------------
Write-Host "Creating ops/..."
$allContexts = @()
foreach ($cluster in $clusterContexts.Keys) { $allContexts += $clusterContexts[$cluster] }

foreach ($ctx in $allContexts) { Ensure-Dir "ops/db-migrations/$ctx" }

Ensure-Dir "ops/observability/dashboards"
Ensure-Dir "ops/observability/alert-rules"
Ensure-File "ops/observability/dashboards/academic-cluster-dashboard.json"
Ensure-File "ops/observability/dashboards/finance-cluster-dashboard.json"
Ensure-File "ops/observability/dashboards/governance-cluster-dashboard.json"
Ensure-File "ops/observability/alert-rules/finance-invoice-failure-rate.yaml"
Ensure-File "ops/observability/alert-rules/grievance-sla-breach.yaml"
Ensure-File "ops/observability/alert-rules/identityaccess-auth-latency.yaml"

Ensure-Dir "ops/pipelines/module-build"
Ensure-Dir "ops/pipelines/module-test"
Ensure-Dir "ops/pipelines/module-release"
Ensure-File "ops/pipelines/module-build/academic-modules.pipeline.yaml"
Ensure-File "ops/pipelines/module-build/administration-modules.pipeline.yaml"
Ensure-File "ops/pipelines/module-build/platform-modules.pipeline.yaml"
Ensure-File "ops/pipelines/module-test/per-module-test.pipeline.yaml"
Ensure-File "ops/pipelines/module-release/selective-release.pipeline.yaml"

# ------------------------------------------------------------------------------
# 8. Root documentation
# ------------------------------------------------------------------------------
if (-not (Test-Path "README.md")) {
    $readmeContent = @"
# University ERP Backend

Domain-Based Modular Architecture (DBMA) monolith. See `domain/model/` for the
business model, `domain/adr/` for architectural decision records, and
`src/Modules/<Cluster>/<Context>/` for bounded-context code. Only `*.Contracts`
projects may be referenced across modules.
"@
    Set-Content -Path "README.md" -Value $readmeContent
}

Write-Host "=============================================================================="
Write-Host "Scaffolding Complete!"
Write-Host "=============================================================================="
