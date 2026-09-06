---
trigger: glob
glob: "University-ERP-Frontend/tests/**"
description: >-
  Rules for authoring, mocking, and executing Vitest and React Testing Library unit tests across all 14 frontend portals and shared libraries.
---

# Canonical Frontend Unit Testing Rules

This document specifies the rules and testing patterns for all unit tests under `University-ERP-Frontend/tests/Unit/`.

---

## 1. Directory Structure & File Placement

- **Canonical Path**: `University-ERP-Frontend/tests/Unit/<portal-name>/<FeatureName>.unit.test.tsx`
  - Example: `tests/Unit/admissions-portal/AdmissionCases.unit.test.tsx`
  - Example: `tests/Unit/registrar-portal/AddDropOversight.unit.test.tsx`
  - Example: `tests/Unit/libs/ui-kit/Button.unit.test.tsx`
- **Never** place test files directly inside `apps/<portal-name>/src/features/`. All unit tests are centralized under `tests/Unit/`.

---

## 2. Test File Setup Standard

Every test file must import test runners from `vitest` and render within both `QueryClientProvider` and `MemoryRouter`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Import the component under test
import { [FeatureName]Page } from '../../../apps/<portal-name>/src/features/<FeatureName>/[FeatureName].page';
```

---

## 3. Mandatory Mocking Boundaries

Unit tests must execute in complete isolation without real HTTP requests or live identity dependencies.

### Auth SDK Mocking
Always mock `@university-erp/auth-sdk` to simulate an authenticated user with proper role attributes:

```tsx
vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    user: { id: 'usr-test-01', name: 'Test User', role: 'Staff' },
    identity: { id: 'usr-test-01', email: 'test@university.edu' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  // If the component renders route guards:
  RegistrarGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FacultyGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  IdentityGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FinanceGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LMSGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
```

### API Client Mocking
Always mock `@university-erp/api-clients` to prevent network calls and return controlled fixture data:

```tsx
vi.mock('@university-erp/api-clients', () => ({
  apiClient: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
  },
  // If feature calls named domain api objects:
  admissionsApi: {
    getApplications: vi.fn().mockResolvedValue([]),
  },
}));
```

---

## 4. Syntax & String Escaping Safety Rules

### Crucial Apostrophe Rule: ALWAYS Use Double Quotes
When authoring test titles, describe blocks, or `it.todo()` statements containing contractions or possessive nouns (e.g., `applicant's`, `dean's`, `system's`, `doesn't`), **ALWAYS wrap the title in double quotes**:

```ts
// ✅ Correct: Double quotes protect single apostrophes
it.todo("should verify the applicant's submitted documents");
it("displays the student's current gradebook standing", () => { ... });

// ❌ Broken: Unescaped single quotes cause fatal JavaScript parser syntax errors
it.todo('should verify the applicant's submitted documents');
```

---

## 5. Robust DOM Querying Best Practices

1. **Avoid ambiguous text queries**:
   When multiple elements contain identical words (e.g. `<option value="Active">Active</option>` and `<Badge>Active</Badge>`), DO NOT use `screen.getByText('Active')`.
   - Instead, specify selector or role: `screen.getByRole('option', { name: 'Active' })` or `screen.getByTestId('status-badge')`.
2. **Button Assertions**:
   Query buttons by accessible role and exact name:
   `screen.getByRole('button', { name: /accept admission/i })`
3. **Async Elements**:
   Use `await screen.findByRole(...)` or `waitFor()` when asserting on elements rendered after React Query resolves.
