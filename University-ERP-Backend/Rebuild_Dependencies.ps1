$ErrorActionPreference = "Stop"

Write-Host "Starting missing DBMA project scaffolding..."

$modulesDir = "src/Modules"
$categories = Get-ChildItem -Path $modulesDir -Directory

$backendRoot = Get-Location
$sharedKernelDomain = Join-Path $backendRoot "src\SharedKernel\SharedKernel.Domain\SharedKernel.Domain.csproj"
$sharedKernelApp = Join-Path $backendRoot "src\SharedKernel\SharedKernel.Application\SharedKernel.Application.csproj"
$sharedKernelInfra = Join-Path $backendRoot "src\SharedKernel\SharedKernel.Infrastructure\SharedKernel.Infrastructure.csproj"

$createdProjects = @()

foreach ($category in $categories) {
    $modules = Get-ChildItem -Path $category.FullName -Directory
    foreach ($module in $modules) {
        $moduleName = $module.Name
        $modPath = $module.FullName
        
        # Skip StudentInformation if already wired completely
        if ($moduleName -eq "StudentInformation" -or $moduleName -eq "IdentityAccess") {
            Write-Host "Skipping $moduleName (core pre-scaffolded module)."
            continue
        }

        Write-Host "Scaffolding missing module: $moduleName in $($category.Name)"

        $domainProjFile   = Join-Path $modPath "$moduleName.Domain\$moduleName.Domain.csproj"
        $appProjFile      = Join-Path $modPath "$moduleName.Application\$moduleName.Application.csproj"
        $infraProjFile    = Join-Path $modPath "$moduleName.Infrastructure\$moduleName.Infrastructure.csproj"
        $presProjFile     = Join-Path $modPath "$moduleName.Presentation\$moduleName.Presentation.csproj"
        $contractProjFile = Join-Path $modPath "$moduleName.Contracts\$moduleName.Contracts.csproj"

        $layers = @("Domain", "Application", "Infrastructure", "Presentation", "Contracts")

        foreach ($layer in $layers) {
            $layerDir = Join-Path $modPath "$moduleName.$layer"
            $projPath = Join-Path $layerDir "$moduleName.$layer.csproj"
            
            # Ensure dir
            if (-not (Test-Path $layerDir)) {
                New-Item -ItemType Directory -Path $layerDir | Out-Null
            }

            # Create classlib if missing
            if (-not (Test-Path $projPath)) {
                Write-Host "  Creating $layer project..."
                dotnet new classlib -n "$moduleName.$layer" -o $layerDir -f net10.0 --force | Out-Null
                
                # Remove default Class1.cs
                $class1 = Join-Path $layerDir "Class1.cs"
                if (Test-Path $class1) { Remove-Item $class1 }
            }

            $createdProjects += $projPath
        }

        # Add Dependencies (The Missing DBMA Pattern)
        Write-Host "  Wiring Dependencies for $moduleName..."
        
        # Domain -> SharedKernel.Domain
        dotnet add "$domainProjFile" reference $sharedKernelDomain | Out-Null

        # Application -> Domain, SharedKernel.Application
        dotnet add "$appProjFile" reference "$domainProjFile" | Out-Null
        dotnet add "$appProjFile" reference $sharedKernelApp | Out-Null

        # Infrastructure -> Application, SharedKernel.Infrastructure
        dotnet add "$infraProjFile" reference "$appProjFile" | Out-Null
        dotnet add "$infraProjFile" reference $sharedKernelInfra | Out-Null

        # Presentation -> Application, Contracts
        dotnet add "$presProjFile" reference "$appProjFile" | Out-Null
        dotnet add "$presProjFile" reference "$contractProjFile" | Out-Null
    }
}

# Update UniversityErp.slnx
$slnxPath = "UniversityErp.slnx"
Write-Host "Updating $slnxPath with new projects..."

$slnxContent = Get-Content $slnxPath
$newSlnx = @()

foreach ($line in $slnxContent) {
    if ($line -match "</Solution>") {
        foreach ($category in $categories) {
            $modules = Get-ChildItem -Path $category.FullName -Directory
            $hasNew = $false
            $categoryFolder = "  <Folder Name=`"/src/Modules/$($category.Name)/`">"
            
            $moduleXml = @()
            foreach ($module in $modules) {
                $moduleName = $module.Name
                $domainProjPath = Join-Path $module.FullName "$moduleName.Domain\$moduleName.Domain.csproj"
                if ($createdProjects -contains $domainProjPath) {
                    $hasNew = $true
                    $moduleXml += "    <Folder Name=`"/src/Modules/$($category.Name)/$moduleName/`">"
                    $moduleXml += "      <Project Path=`"src/Modules/$($category.Name)/$moduleName/$moduleName.Application/$moduleName.Application.csproj`" />"
                    $moduleXml += "      <Project Path=`"src/Modules/$($category.Name)/$moduleName/$moduleName.Contracts/$moduleName.Contracts.csproj`" />"
                    $moduleXml += "      <Project Path=`"src/Modules/$($category.Name)/$moduleName/$moduleName.Domain/$moduleName.Domain.csproj`" />"
                    $moduleXml += "      <Project Path=`"src/Modules/$($category.Name)/$moduleName/$moduleName.Infrastructure/$moduleName.Infrastructure.csproj`" />"
                    $moduleXml += "      <Project Path=`"src/Modules/$($category.Name)/$moduleName/$moduleName.Presentation/$moduleName.Presentation.csproj`" />"
                    $moduleXml += "    </Folder>"
                }
            }
            
            if ($hasNew) {
                $newSlnx += $categoryFolder
                $newSlnx += $moduleXml
                $newSlnx += "  </Folder>"
            }
        }
    }
    $newSlnx += $line
}

Set-Content -Path $slnxPath -Value $newSlnx
Write-Host "Scaffolding Complete! Please run 'dotnet build UniversityErp.slnx' to verify."
