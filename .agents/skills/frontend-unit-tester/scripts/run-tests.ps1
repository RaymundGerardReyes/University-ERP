param(
    [string]$Portal = ""
)

$frontendRoot = "D:\University-ERP\University-ERP-Frontend"
Push-Location $frontendRoot

try {
    if ($Portal -and $Portal -ne "all") {
        Write-Host "Running tests for portal: $Portal..." -ForegroundColor Cyan
        npx vitest run "tests/Unit/$Portal"
    } else {
        Write-Host "Running all unit tests..." -ForegroundColor Cyan
        npx vitest run "tests/Unit"
    }
} finally {
    Pop-Location
}

