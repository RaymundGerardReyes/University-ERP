---
trigger: glob
glob: "University-ERP-Frontend/**"
description: >-
  Enforces Domain-Based Modular Architecture (DBMA), UI Kit tokens, React Query conventions, and vertical slice structures across all 14 frontend applications and 9 shared libraries.
---

# Frontend Domain-Based Modular Architecture (DBMA) Rules

This document specifies the canonical standards for writing, organizing, and maintaining code within `University-ERP-Frontend`.

---

## 1. Portal Inventory & Role Boundaries

The frontend contains 14 role-dedicated web portals in `apps/`:

| Portal Name | Role / Target Audience | Key Features & Responsibilities |
| :--- | :--- | :--- |
| `admin-portal` | Super Admin & System Ops | Academic configuration, organization management, audit compliance, asset registry |
| `admissions-portal` | Admissions Officers & Staff | Applicant evaluation, interview scoring, admission cases, enrollment handoff |
| `applicant-portal` | Prospective Students | Application wizard, eligibility checker, document upload, status tracker |
| `faculty-portal` | Professors & Instructors | Advising, grade submission, teaching schedules, course section rosters |
| `finance-console` | Cashiers & Financial Analysts | Tuition assessment, invoicing, student billing, downpayment, payroll |
| `governance-console` | Compliance Officers & Deans | Accreditation, compliance audits, committees, policies, risk management |
| `identity-portal` | Security Admins & Users | User authentication, MFA setup, session management, password recovery |
| `library-portal` | Librarians & Patrons | Catalog search, circulation, digital resources, reservations, fine management |
| `lms-web` | Students & Teachers (Web) | Course content, discussions, quizzes, assignments, offline sync review |
| `payment-gateway` | Payment Processing Subsystem | Secure hosted checkout, banking callback handlers, QR payments |
| `platform-console` | Platform Engineers | API keys, database management, multi-campus orchestration, system logs |
| `registrar-portal` | University Registrar | Curriculum catalog, add/drop oversight, waitlists, graduation clearance, transcripts |
| `security-portal` | Security & Access Control | Host shell, centralized security audit, route authorization enforcement |
| `student-portal` | Enrolled University Students | Course registration, schedule/timetable, grades, tuition payment, student clearance |

Plus the cross-platform desktop application:
- `clients/lms-offline-avalonia`: Avalonia C# .NET 10 desktop application with encrypted SQLite storage for air-gapped LMS operation.

---

## 2. Shared Libraries Contract (`libs/`)

All cross-cutting logic must be consumed from `libs/` via workspace aliases:

1. **`@university-erp/ui-kit`** (`libs/ui-kit`):
   - Standard primitives: `Badge`, `Button`, `Card`, `DocumentPreviewModal`, `EmptyState`, `FormInput`, `Modal`, `PageHeader`, `Table`.
   - Never write raw unstyled HTML elements (`<button>`, `<table>`) when a UI Kit primitive exists.
   - Use CSS variables for styling: `var(--brand-primary)`, `var(--bg-surface)`, `var(--border-color)`, `var(--text-primary)`.

2. **`@university-erp/auth-sdk`** (`libs/auth-sdk`):
   - React hooks: `useAuth()`, providing `{ user, identity, isAuthenticated, login, logout }`.
   - Route guards: `RegistrarGuard`, `FacultyGuard`, `IdentityGuard`, `FinanceGuard`, `LMSGuard`.
   - Never inspect raw tokens or make ad-hoc session checks.

3. **`@university-erp/api-clients`** (`libs/api-clients`):
   - Strongly typed clients grouped by domain: `admissionsApi`, `financeApi`, `registrarApi`, `teachingApi`, etc.
   - All network calls must pass through these clients.

4. **`@university-erp/shell-kit`** (`libs/shell-kit`):
   - `AppShell`, `AuthGuard`, `portalRegistry`, `queryClient`, `bootstrapPortal`.

5. **`@university-erp/domain-viewmodels`** (`libs/domain-viewmodels`):
   - Standard TypeScript view models shared across portals.

6. **`@university-erp/core-logger`** (`libs/core-logger`):
   - Structured logging: `createLogger(appName, moduleName)`.
   - Sends logs to dev terminal via `POST /__terminal-log` and production telemetry.

7. **`@university-erp/workflow-sdk`** (`libs/workflow-sdk`):
   - Reusable multi-step workflows (`AdmissionWorkflow`, `EnrollmentWorkflow`, etc.).

---

## 3. Vertical Slice Feature Anatomy

Every feature under `apps/<portal-name>/src/features/<FeatureName>/` must strictly adhere to the following file convention:

```
apps/<portal-name>/src/features/<FeatureName>/
├── <FeatureName>.page.tsx     # Route entry point and view controller
├── <FeatureName>.api.ts      # Typed API client methods
├── <FeatureName>.hooks.ts    # Encapsulated TanStack React Query hooks
├── <FeatureName>.types.ts    # DTOs, payload interfaces, view models
└── components/               # Sub-components exclusive to this feature
```

### `<FeatureName>.types.ts`
```ts
export interface FeatureRecord {
  id: string;
  title: string;
  status: 'Pending' | 'Active' | 'Archived';
  updatedAt: string;
}

export interface CreateFeaturePayload {
  title: string;
}
```

### `<FeatureName>.api.ts`
```ts
import { apiClient } from '@university-erp/api-clients';
import { FeatureRecord, CreateFeaturePayload } from './[FeatureName].types';

export const [featureName]Api = {
  getRecords: async (): Promise<FeatureRecord[]> => {
    const res = await apiClient.get('/api/v1/[domain]/[endpoint]');
    return res.data;
  },
  createRecord: async (payload: CreateFeaturePayload): Promise<FeatureRecord> => {
    const res = await apiClient.post('/api/v1/[domain]/[endpoint]', payload);
    return res.data;
  },
};
```

### `<FeatureName>.hooks.ts`
```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { [featureName]Api } from './[FeatureName].api';
import { CreateFeaturePayload } from './[FeatureName].types';

export function use[FeatureName]Data() {
  return useQuery({
    queryKey: ['[featureName]Records'],
    queryFn: () => [featureName]Api.getRecords(),
  });
}

export function useCreate[FeatureName]() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFeaturePayload) => [featureName]Api.createRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[featureName]Records'] });
    },
  });
}
```

### `<FeatureName>.page.tsx`
```tsx
import React from 'react';
import { PageHeader, Card, Table, Button, Badge } from '@university-erp/ui-kit';
import { use[FeatureName]Data } from './[FeatureName].hooks';

export const [FeatureName]Page: React.FC = () => {
  const { data, isLoading, isError } = use[FeatureName]Data();

  if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;
  if (isError) return <div className="error-banner">Failed to load records.</div>;

  return (
    <div className="fade-in">
      <PageHeader
        title="[Feature Title]"
        subtitle="Manage and view domain records."
      />
      <Card>
        <Table data={data || []} />
      </Card>
    </div>
  );
};
```

---

## 4. State Management & Cache Rules

- Server state MUST be managed with `@tanstack/react-query`.
- Cache invalidation MUST be explicitly handled in mutation `onSuccess` handlers.
- Never duplicate server data into local `useState` unless it is an active, unsubmitted draft or edit buffer.
- When rendering modals, forms, or drawers, pass data through props or read directly from the query cache.

---

## 5. Payment Gateway & Two-Way Reconciliation Invariants

1. **Explicit Return URL Transmission**:
   - Whenever an app creates an external payment gateway session (via `financeApi.createPaymentSession` or module-specific API clients), it **MUST** include an explicit `returnUrl` indicating where the payment gateway redirects the browser after checkout (e.g. `${window.location.origin}/payment-return?type=...`).
   - Never rely on static server-side default redirect URLs for browser callbacks.

2. **Dedicated Payment Return Route**:
   - Any portal invoking online checkout must register a dedicated `/payment-return` route (e.g., `PaymentReturn.page.tsx`).
   - The return page must:
     - Extract `sessionId` from query params (`?sessionId=...` or `?paymentSessionId=...`).
     - Query `financePaymentSessionApi.validateSession(sessionId)` to verify final ledger status.
     - Invalidate relevant query keys (`['finance']`, `['admissions']`, `['academic']`) upon verification.
     - Display clear contextual messaging and routing based on the transaction type (`enrollment` vs `application-fee`).

3. **Status Normalization**:
   - External gateways and backend ledger processors return varied casing and synonyms for completed transactions (`'PAID'`, `'COMPLETED'`, `'SETTLED'`, `'VERIFIED'`, `'PAYMENT_VERIFIED'`).
   - Always normalize statuses case-insensitively using canonical lookup sets rather than strict single-string equality checks.

4. **Applicant-to-Student Enrollment Transition**:
   - When an applicant's status reaches `'Enrolled'` (via admissions evaluation or registrar handoff):
     - The applicant view must display their assigned official **University ID / Student Number**.
     - Provide a direct link or transition button to the **Student Portal** (`VITE_STUDENT_PORTAL_URL`).

