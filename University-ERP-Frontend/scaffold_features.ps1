$ErrorActionPreference = "Stop"

# Define the target features for the Admin Portal
$adminFeatures = @(
    "AcademicConfiguration", "AssetRegistry", "AuditCompliance", "CanteenOrders", 
    "Dashboard", "EmployeeManagement", "FacilityBooking", "FleetManagement", 
    "IdentitySecurity", "IntegrationManagement", "OrganizationManagement", 
    "PurchaseOrders", "Reports", "RoleAdministration", "PlatformMonitoring", 
    "StockManagement", "SystemAdministration", "UserAdministration", "WorkflowManagement"
)

# Define the target features for the Faculty Portal
$facultyFeatures = @(
    "Advising", "Analytics", "Assessments", "Communication", "Dashboard", 
    "Documents", "Research", "Schedule", "Settings", "Students", "Teaching"
)

# Define the target features for the Applicant Portal
$applicantFeatures = @(
    "ApplicationForm", "DocumentUpload", "ApplicationStatus", "InterviewScheduling", "Offers"
)

# Define the target features for the Student Portal
$studentFeatures = @(
    "Dashboard", "AcademicRecord", "Enrollment", "Financials", "Timetable", "Extracurriculars", "Clearance"
)

# Define the target features for the Finance Console
$financeFeatures = @(
    "Dashboard", "StudentBilling", "Payroll", "Invoicing", "Budgeting", "FinancialReports", "PaymentGateway"
)

# Define the target features for the Library Portal
$libraryFeatures = @(
    "CatalogSearch", "MyLoans", "Reservations", "Fines", "DigitalResources"
)

# Define the target features for the Platform Console
$platformFeatures = @(
    "TenantManagement", "SystemLogs", "GlobalSettings", "APIKeys", "DatabaseManagement", "SecurityAudits"
)

# Define the target features for the LMS Web
$lmsFeatures = @(
    "Dashboard", "CourseContent", "Assignments", "Quizzes", "Discussions", "Grades", "Calendar"
)

# Define the target features for the Governance Console
$governanceFeatures = @(
    "Policies", "Compliance", "Accreditation", "Committees", "Audits", "RiskManagement"
)

# Define the target features for the Identity Portal
$identityFeatures = @(
    "UserLogin", "UserRegistration", "PasswordRecovery", "MultiFactorAuth", "SessionManagement"
)


function Scaffold-Portal-Features($portalName, $featuresList) {
    Write-Host "Scaffolding features for $portalName..." -ForegroundColor Cyan
    
    # FIXED BASE PATH: Now explicitly points to the University-ERP-Frontend directory
    $basePath = "University-ERP-Frontend\apps\$portalName\src\features"

    foreach ($feature in $featuresList) {
        $featureDir = Join-Path $basePath $feature
        
        # Create the isolated feature directory
        if (-not (Test-Path $featureDir)) {
            New-Item -ItemType Directory -Force -Path $featureDir | Out-Null
        }

        # Define the strict 5-file DDD pattern
        $filesToCreate = @(
            "$feature.api.ts",
            "$feature.hooks.ts",
            "$feature.page.tsx",
            "$feature.test.tsx",
            "$feature.types.ts"
        )

        foreach ($file in $filesToCreate) {
            $filePath = Join-Path $featureDir $file
            if (-not (Test-Path $filePath)) {
                # Create the empty file
                New-Item -ItemType File -Path $filePath | Out-Null
            }
        }
        Write-Host "  Successfully scaffolded: $feature" -ForegroundColor Green
    }
}

# Execute the scaffolding across all 10 DBMA Portals
Write-Host "Initializing UI Module Scaffolding Process..." -ForegroundColor Yellow

Scaffold-Portal-Features "admin-portal" $adminFeatures
Scaffold-Portal-Features "faculty-portal" $facultyFeatures
Scaffold-Portal-Features "applicant-portal" $applicantFeatures
Scaffold-Portal-Features "student-portal" $studentFeatures
Scaffold-Portal-Features "finance-console" $financeFeatures
Scaffold-Portal-Features "library-portal" $libraryFeatures
Scaffold-Portal-Features "platform-console" $platformFeatures
Scaffold-Portal-Features "lms-web" $lmsFeatures
Scaffold-Portal-Features "governance-console" $governanceFeatures
Scaffold-Portal-Features "identity-portal" $identityFeatures

Write-Host "All DBMA portal features have been successfully structured!" -ForegroundColor Magenta