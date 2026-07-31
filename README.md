# University ERP Frontend

Domain-Based Modular Architecture (DBMA) frontend monorepo. See `domain/model/`
for the shared business model (synced from backend), `apps/` for subdomain
React TS portals, `clients/lms-offline-avalonia/` for the hybrid offline LMS,
and `libs/` for the shared frontend kernel. Only `libs/*` may be imported
across apps.
