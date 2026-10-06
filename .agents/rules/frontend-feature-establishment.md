# Frontend Feature Establishment & Contract Integrity Rules

This document establishes the mandatory architectural rules for developing, routing, and completing frontend features across all portals in `University-ERP-Frontend/apps/`.

---

## 1. Zero Raw HTTP Imports (Rule 4 Enforcement)
- **Portals MUST NEVER import `axios` or call raw `fetch()` directly**.
- All network interactions must flow through `@university-erp/api-clients`:
  - Use typed domain clients (`admissionsApi`, `identityApi`, `financeApi`, etc.) or the authenticated [`apiClient`](file:///d:/University-ERP/University-ERP-Frontend/libs/api-clients/apiClient.ts).
  - Calling raw `axios.get` or `axios.post` bypasses the global JWT Authorization interceptor (`global_identity_token`) and breaks central observability.

---

## 2. No Orphaned / Unrouted Feature Slices
- Every directory under `apps/<portal-name>/src/features/<FeatureName>/` must be actively integrated into the application:
  1. **Route Mapping**: Registered in `src/shell/Routing.tsx`.
  2. **Navigation Accessibility**: Linked via `AppShell.tsx`, sidebar navigation, or an authenticated parent route.
  3. **No Dead Scaffolding**: Unmounted or dormant features must either be wired into the router or cleanly deprecated; never leave disconnected slices on disk.

---

## 3. Zero-Tolerance for Hollow or 0-Byte Slices
- Features must maintain a complete Domain-Based Modular Architecture (DBMA) vertical slice:
  - `<FeatureName>.page.tsx`: Full interactive view with loading skeletons, error states, and responsive layout.
  - `<FeatureName>.api.ts`: Real API calls returning typed promises; **never empty 0-byte files**.
  - `<FeatureName>.hooks.ts`: TanStack Query hooks (`useQuery`, `useMutation`).
  - `<FeatureName>.types.ts`: TypeScript view models and request/response DTOs.
- **No Static Placeholder Copy**: Never ship views that merely render `<p>Feature is active and initialized.</p>` without data bindings or user actions.

---

## 4. No Catch-All Silent Fallback to Fake Mock Data
- API functions in `<Feature>.api.ts` must NOT wrap queries in silent `try/catch` blocks that swallow errors and return hardcoded mock data:
  ```typescript
  // ❌ FORBIDDEN: Hides backend defects and server 500 errors
  try {
    const res = await apiClient.get('/api/v1/governance/audits');
    return res.data;
  } catch {
    return [ { id: 'AUD-01', ... } ];
  }
  ```
- Errors must propagate to TanStack Query so that `<QueryErrorResetBoundary>`, error toasts, or retry handlers can react appropriately.

---

## 5. No Unsafe SDK Casts (`(api as any)`)
- Avoid bypassing TypeScript contracts with `(someApi as any).nonExistentMethod?.() ?? []`.
- If an endpoint or method is needed by a frontend portal, implement and export the strongly typed method inside `libs/api-clients/` before consuming it in the portal.

---

## 6. Meaningful Test Verification vs. `it.todo` Resolution
- **No Superficial Heading Tests**: Unit tests asserting only `expect(screen.getByRole('heading')).toBeInTheDocument()` are prohibited. Tests must assert user inputs, form submissions, query parameter bindings, and modal states.
- **Progressive `it.todo` Hardening**: As features transition from planned specifications to implementation, transform existing `it.todo(...)` definitions into live assertions using `@testing-library/react`.

