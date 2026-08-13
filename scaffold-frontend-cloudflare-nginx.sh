#!/bin/bash
# ==============================================================================
# University ERP Frontend - Domain-Based Modular Architecture Scaffolding Script
# Includes Cloudflare + Nginx reverse proxy structure
# ==============================================================================
set -euo pipefail

if [ -z "${BASH_VERSION:-}" ]; then
  echo "ERROR: this script must be run with bash (bash scaffold-frontend.sh), not sh." >&2
  exit 1
fi

echo "Starting scaffolding for University ERP Frontend DBMA..."

# ------------------------------------------------------------------------------
# Shared helper functions (idempotent, re-run safe)
# ------------------------------------------------------------------------------
ensure_dir() {
  mkdir -p "$1"
  if [ -z "$(find "$1" -maxdepth 1 -mindepth 1 2>/dev/null)" ]; then
    touch "$1/.gitkeep"
  fi
}

ensure_file() {
  [ -f "$1" ] || touch "$1"
}

write_file() {
  local path=$1
  local content=$2
  if [ ! -f "$path" ]; then
    printf '%s\n' "$content" > "$path"
  fi
}

# ------------------------------------------------------------------------------
# 0. Root files
# ------------------------------------------------------------------------------
cat > .gitignore <<'EOF'
node_modules/
dist/
build/
.env
.env.local
bin/
obj/
*.user
EOF

if [ ! -f README.md ]; then
cat > README.md <<'EOF'
# University ERP Frontend

Domain-Based Modular Architecture (DBMA) frontend monorepo. See `domain/model/`
for the shared business model (synced from backend), `apps/` for subdomain
React TS portals, `clients/lms-offline-avalonia/` for the hybrid offline LMS,
and `libs/` for the shared frontend kernel. Only `libs/*` may be imported
across apps.
EOF
fi

# ------------------------------------------------------------------------------
# 1. domain/ - Shared Business Knowledge (synced from backend)
# ------------------------------------------------------------------------------
echo "Creating domain/..."
ensure_dir domain/model
ensure_dir domain/adr
ensure_dir domain/runbooks

for f in ADR-F01-avalonia-for-offline-lms-client \
         ADR-F02-react-ts-for-subdomain-web-portals \
         ADR-F03-shared-auth-sdk-across-react-and-dotnet \
         ADR-F04-indexeddb-vs-sqlite-offline-strategy-split; do
  ensure_file "domain/adr/$f.md"
done
ensure_file domain/runbooks/cdn-cache-poisoning.md
ensure_file domain/runbooks/offline-sync-conflict-storm.md

# ------------------------------------------------------------------------------
# 2. apps/ - One React TS App per Bounded-Context Cluster
# ------------------------------------------------------------------------------
echo "Creating apps/..."

create_react_app_structure() {
    local app_name=$1
    local base_path="apps/$app_name"

    ensure_dir "$base_path/src/features"
    ensure_dir "$base_path/src/shell"
    ensure_dir "$base_path/src/state"
    ensure_dir "$base_path/src/config"
    ensure_dir "$base_path/public"

    ensure_file "$base_path/src/shell/AppShell.tsx"
    ensure_file "$base_path/src/shell/Routing.tsx"
    ensure_file "$base_path/src/shell/AuthGuard.tsx"
    ensure_file "$base_path/src/state/queryClient.ts"
    ensure_file "$base_path/src/config/env.ts"
    ensure_file "$base_path/src/config/authConfig.ts"
    ensure_file "$base_path/src/main.tsx"
    ensure_file "$base_path/index.html"

    if [ ! -f "$base_path/package.json" ]; then
      cat > "$base_path/package.json" <<EOF
{
  "name": "$app_name",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  }
}
EOF
    fi
    ensure_file "$base_path/tsconfig.json"
    ensure_file "$base_path/vite.config.ts"
}

APPS="identity-portal student-portal faculty-portal admin-portal lms-web finance-console library-portal governance-console"
for app in $APPS; do
  create_react_app_structure "$app"
done

# lms-web offline-specific additions (PWA + light offline)
ensure_dir apps/lms-web/src/offline
ensure_dir apps/lms-web/src/features/ModuleTimeline
ensure_dir apps/lms-web/src/features/QuizWindowGuard
ensure_dir apps/lms-web/src/features/AssignmentDraftEditor
ensure_file apps/lms-web/src/offline/indexedDbSchema.ts
ensure_file apps/lms-web/src/offline/syncQueue.ts
ensure_file apps/lms-web/src/offline/serviceWorkerRegistration.ts
ensure_file apps/lms-web/public/manifest.webmanifest
ensure_file apps/lms-web/public/service-worker.ts

# ------------------------------------------------------------------------------
# 3. clients/lms-offline-avalonia/ - Hybrid Online/Offline LMS (.NET)
# ------------------------------------------------------------------------------
echo "Creating clients/lms-offline-avalonia/..."

AVALONIA_BASE="clients/lms-offline-avalonia"

ensure_dir "$AVALONIA_BASE/LmsOffline.Domain/Aggregates"
ensure_dir "$AVALONIA_BASE/LmsOffline.Domain/ValueObjects"
ensure_dir "$AVALONIA_BASE/LmsOffline.Domain/Policies"
ensure_dir "$AVALONIA_BASE/LmsOffline.Domain/Exceptions"
ensure_file "$AVALONIA_BASE/LmsOffline.Domain/Aggregates/OfflineModule.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Domain/Aggregates/OfflineAssessment.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Domain/Aggregates/OfflineAssignment.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Domain/ValueObjects/AvailabilityWindow.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Domain/ValueObjects/AttemptToken.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Domain/ValueObjects/SyncStatus.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Domain/Policies/WindowEnforcementPolicy.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Domain/Exceptions/AssessmentWindowClosedException.cs"

ensure_dir "$AVALONIA_BASE/LmsOffline.Application/Features/DownloadModulePackage"
ensure_dir "$AVALONIA_BASE/LmsOffline.Application/Features/StartOfflineAssessment"
ensure_dir "$AVALONIA_BASE/LmsOffline.Application/Features/SubmitOfflineAssignment"
ensure_dir "$AVALONIA_BASE/LmsOffline.Application/Features/SyncPendingSubmissions"
ensure_file "$AVALONIA_BASE/LmsOffline.Application/ModuleRegistration.cs"

ensure_dir "$AVALONIA_BASE/LmsOffline.Infrastructure/Persistence/Migrations"
ensure_dir "$AVALONIA_BASE/LmsOffline.Infrastructure/Sync"
ensure_dir "$AVALONIA_BASE/LmsOffline.Infrastructure/Auth"
ensure_file "$AVALONIA_BASE/LmsOffline.Infrastructure/Persistence/EncryptedSqliteContext.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Infrastructure/Sync/OutboxSyncProcessor.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Infrastructure/Sync/ScheduleTokenVerifier.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Infrastructure/Auth/OfflineTokenCache.cs"

ensure_dir "$AVALONIA_BASE/LmsOffline.Presentation/Views"
ensure_dir "$AVALONIA_BASE/LmsOffline.Presentation/ViewModels"
ensure_file "$AVALONIA_BASE/LmsOffline.Presentation/Views/ModuleTimelineView.axaml"
ensure_file "$AVALONIA_BASE/LmsOffline.Presentation/Views/AssessmentView.axaml"
ensure_file "$AVALONIA_BASE/LmsOffline.Presentation/Views/AssignmentSubmissionView.axaml"

ensure_dir "$AVALONIA_BASE/LmsOffline.Contracts/IntegrationEvents"
ensure_file "$AVALONIA_BASE/LmsOffline.Contracts/IntegrationEvents/OfflineAssessmentSubmitted.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Contracts/IntegrationEvents/OfflineAssignmentSubmitted.cs"

ensure_dir "$AVALONIA_BASE/LmsOffline.Tests"
ensure_file "$AVALONIA_BASE/LmsOffline.Tests/WindowEnforcementPolicyTests.cs"
ensure_file "$AVALONIA_BASE/LmsOffline.Tests/SyncConflictResolutionTests.cs"

# If dotnet CLI is available, scaffold real buildable class libraries (idempotent)
if command -v dotnet >/dev/null 2>&1; then
  for proj in Domain Application Infrastructure Contracts Tests; do
    proj_dir="$AVALONIA_BASE/LmsOffline.$proj"
    if [ ! -f "$proj_dir/LmsOffline.$proj.csproj" ]; then
      if [ "$proj" = "Tests" ]; then
        dotnet new xunit -n "LmsOffline.$proj" -o "$proj_dir" --force >/dev/null
      else
        dotnet new classlib -n "LmsOffline.$proj" -o "$proj_dir" --force >/dev/null
        rm -f "$proj_dir/Class1.cs"
      fi
    fi
  done
  if [ ! -f "$AVALONIA_BASE/LmsOffline.Presentation/LmsOffline.Presentation.csproj" ]; then
    dotnet new avalonia.app -n "LmsOffline.Presentation" -o "$AVALONIA_BASE/LmsOffline.Presentation" --force >/dev/null 2>&1 || \
    echo "NOTE: 'avalonia.app' template not installed. Run: dotnet new install Avalonia.Templates" >&2
  fi
else
  echo "NOTE: dotnet CLI not found; created folder/file skeleton only for lms-offline-avalonia." >&2
fi

# ------------------------------------------------------------------------------
# 4. libs/ - Shared Frontend Kernel (deliberately small)
# ------------------------------------------------------------------------------
echo "Creating libs/..."

ensure_dir libs/ui-kit/components
ensure_dir libs/ui-kit/tokens
ensure_dir libs/ui-kit/theming

ensure_dir libs/auth-sdk/react
ensure_dir libs/auth-sdk/dotnet
ensure_file libs/auth-sdk/react/AuthProvider.tsx
ensure_file libs/auth-sdk/react/useAuth.ts
ensure_file libs/auth-sdk/react/silentRefresh.ts
ensure_file libs/auth-sdk/dotnet/OidcClient.cs

CLUSTERS="academic student-lifecycle administration governance platform"
for cluster in $CLUSTERS; do
  ensure_dir "libs/api-clients/$cluster"
done
ensure_file libs/api-clients/academic/registrarCurriculumApi.ts
ensure_file libs/api-clients/academic/examinationResultApi.ts
ensure_file libs/api-clients/student-lifecycle/studentInformationReadModel.ts
ensure_file libs/api-clients/administration/financeBillingApi.ts
ensure_file libs/api-clients/governance/facilitiesAvailabilityApi.ts
ensure_file libs/api-clients/platform/identityAccessAuthorizationApi.ts

ensure_dir libs/domain-viewmodels
ensure_file libs/domain-viewmodels/StudentProfileViewModel.ts
ensure_file libs/domain-viewmodels/InvoiceSummaryViewModel.ts
ensure_file libs/domain-viewmodels/GrievanceCaseViewModel.ts

ensure_dir libs/offline-sync
ensure_file libs/offline-sync/syncEngineContracts.ts
ensure_file libs/offline-sync/conflictResolutionRules.md

# ------------------------------------------------------------------------------
# 5. tests/ - Frontend Architectural Guarantees
# ------------------------------------------------------------------------------
echo "Creating tests/..."

ensure_dir tests/ArchitectureTests
ensure_file tests/ArchitectureTests/dependency-cruiser.config.js

for app in $APPS; do
  ensure_dir "tests/ComponentTests/$app"
done

ensure_dir tests/E2ETests
ensure_file tests/E2ETests/StudentEnrollmentFlow.spec.ts
ensure_file tests/E2ETests/OfflineQuizWindowFlow.spec.ts
ensure_file tests/E2ETests/HostelBillingFlow.spec.ts

ensure_dir tests/AccessibilityTests
ensure_file tests/AccessibilityTests/wcag-audit.spec.ts

ensure_dir tests/PerformanceTests
ensure_file tests/PerformanceTests/lighthouse-budgets.json

ensure_dir tests/SecurityTests
ensure_file tests/SecurityTests/tokenStorageAuditTests.ts
ensure_file tests/SecurityTests/cspComplianceTests.ts

# ------------------------------------------------------------------------------
# 6. ops/cloudflare/ - Outer Edge (DNS, CDN, WAF, DDoS)
# ------------------------------------------------------------------------------
echo "Creating ops/cloudflare/..."

ensure_dir ops/cloudflare/dns
ensure_dir ops/cloudflare/waf-rules
ensure_dir ops/cloudflare/page-rules
ensure_dir ops/cloudflare/workers

write_file ops/cloudflare/dns/university-erp-zone.tf '# Terraform: Cloudflare DNS zone + per-subdomain records
# resource "cloudflare_record" "student" { name = "student" ... }
# resource "cloudflare_record" "faculty" { name = "faculty" ... }
# resource "cloudflare_record" "admin"   { name = "admin"   ... }
# resource "cloudflare_record" "lms"     { name = "lms"     ... }
# resource "cloudflare_record" "finance" { name = "finance" ... }
# resource "cloudflare_record" "library" { name = "library" ... }
# resource "cloudflare_record" "governance" { name = "governance" ... }
# resource "cloudflare_record" "portal"  { name = "portal"  ... }
# resource "cloudflare_record" "auth"    { name = "auth"    ... }
# resource "cloudflare_record" "api"     { name = "api"     ... }'

ensure_file ops/cloudflare/waf-rules/rate-limiting.json
ensure_file ops/cloudflare/waf-rules/bot-fight-mode.json
ensure_file ops/cloudflare/waf-rules/owasp-managed-ruleset.json
ensure_file ops/cloudflare/page-rules/cache-static-assets.json
ensure_file ops/cloudflare/page-rules/bypass-cache-api.json
ensure_file ops/cloudflare/workers/security-headers-worker.js

# ------------------------------------------------------------------------------
# 7. ops/nginx/ - Inner Reverse Proxy (DMZ)
# ------------------------------------------------------------------------------
echo "Creating ops/nginx/..."

ensure_dir ops/nginx/sites-available
ensure_dir ops/nginx/sites-enabled
ensure_dir ops/nginx/snippets
ensure_dir ops/nginx/ssl

write_file ops/nginx/snippets/security-headers.conf 'add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src '"'"'self'"'"'" always;'

write_file ops/nginx/snippets/rate-limit.conf 'limit_req_zone $binary_remote_addr zone=erp_limit:10m rate=10r/s;
limit_req zone=erp_limit burst=20 nodelay;'

write_file ops/nginx/snippets/proxy-common.conf 'proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;'

generate_nginx_site() {
  local subdomain=$1
  local upstream_port=$2
  local conf_path="ops/nginx/sites-available/$subdomain.university.edu.conf"

  if [ ! -f "$conf_path" ]; then
    cat > "$conf_path" <<EOF
server {
    listen 443 ssl;
    server_name $subdomain.university.edu;

    include snippets/security-headers.conf;
    include snippets/rate-limit.conf;

    ssl_certificate     /etc/nginx/ssl/$subdomain.university.edu.crt;
    ssl_certificate_key /etc/nginx/ssl/$subdomain.university.edu.key;

    location / {
        proxy_pass http://127.0.0.1:$upstream_port;
        include snippets/proxy-common.conf;
    }
}

server {
    listen 80;
    server_name $subdomain.university.edu;
    return 301 https://\$host\$request_uri;
}
EOF
  fi
}

generate_nginx_site "student"     4301
generate_nginx_site "faculty"     4302
generate_nginx_site "admin"       4303
generate_nginx_site "lms"         4304
generate_nginx_site "finance"     4305
generate_nginx_site "library"     4306
generate_nginx_site "governance"  4307
generate_nginx_site "portal"      4308
generate_nginx_site "auth"        4309
generate_nginx_site "api"         5000

# ------------------------------------------------------------------------------
# 8. ops/pipelines/ - Per-App CI/CD
# ------------------------------------------------------------------------------
echo "Creating ops/pipelines/..."

ensure_dir ops/pipelines/app-build
ensure_dir ops/pipelines/app-test
ensure_dir ops/pipelines/app-release
ensure_dir ops/pipelines/edge-deploy

ensure_file ops/pipelines/app-build/react-apps.pipeline.yaml
ensure_file ops/pipelines/app-build/avalonia-client.pipeline.yaml
ensure_file ops/pipelines/app-test/per-app-test.pipeline.yaml
ensure_file ops/pipelines/app-release/selective-release.pipeline.yaml
ensure_file ops/pipelines/edge-deploy/cloudflare-nginx-sync.pipeline.yaml

echo "=============================================================================="
echo "Frontend + Cloudflare + Nginx Scaffolding Complete!"
echo "=============================================================================="
