@echo off
echo =======================================================
echo LMS Offline - Secure Build Script
echo =======================================================

echo.
echo [1/3] Terminating any running instances of the application...
taskkill /F /IM LmsOffline.Presentation.exe /T 2>NUL
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Successfully closed running instance.
) else (
    echo [INFO] No running instances found. Proceeding...
)

echo.
echo [2/3] Cleaning previous publish artifacts...
if exist "LmsOffline.Presentation\bin\Release\net10.0\win-x64\publish\LmsOffline.Presentation.exe" (
    del /F /Q "LmsOffline.Presentation\bin\Release\net10.0\win-x64\publish\LmsOffline.Presentation.exe" 2>NUL
)

echo.
echo [3/3] Executing dotnet publish...
dotnet publish "LmsOffline.Presentation\LmsOffline.Presentation.csproj" -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true

echo.
echo =======================================================
echo Build process complete.
pause
