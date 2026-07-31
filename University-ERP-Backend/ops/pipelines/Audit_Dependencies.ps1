$ErrorActionPreference = "Stop"
Write-Host "Starting Security Audit for .NET Backend Dependencies..." -ForegroundColor Cyan

# Define the path to the root solution file
$slnPath = "..\..\UniversityErp.slnx"

if (-not (Test-Path $slnPath)) {
    Write-Host "Error: Solution file not found at $slnPath" -ForegroundColor Red
    exit 1
}

Write-Host "Restoring packages..."
dotnet restore $slnPath | Out-Null

Write-Host "Scanning for vulnerable transitive and direct dependencies..."
# The --vulnerable flag specifically filters for packages with known CVEs
$auditResult = dotnet list $slnPath package --vulnerable --include-transitive

# Check if the output contains warnings about vulnerable packages
if ($auditResult -match "has the following vulnerable packages") {
    Write-Host "`n[!] CRITICAL: Vulnerable packages detected in the backend!`n" -ForegroundColor Red
    Write-Host $auditResult
    exit 1 # Fail the script to stop the CI/CD pipeline
} else {
    Write-Host "`n[+] Audit Passed: No known vulnerable dependencies found." -ForegroundColor Green
}
