# University-ERP Frontend - Rules & Guidelines

This document governs all frontend development within `University-ERP-Frontend`.

---

## 1. Monorepo & Workspace Rules

1. **Strict Workspace Hoisting**:
   - Every dependency must be hoisted to `University-ERP-Frontend/node_modules/`.
   - Never run `npm install` inside an individual `apps/<portal>` folder that causes un-hoisted nested `node_modules`.
   - Any dependency conflict must be resolved at the root `package.json` level.
2. **Library Boundaries**:
   - `apps/*` may depend on `libs/*`.
   - `libs/*` must NEVER depend on `apps/*`.
   - Cyclic dependencies between libraries (`libs/ui-kit` -> `libs/shell-kit`) are strictly forbidden.

---

## 2. DBMA & Component Conventions

1. **Vertical Feature Slicing**:
   Each feature within `apps/<portal>/src/features/<FeatureName>` must contain:
   - `<FeatureName>.page.tsx`
   - `<FeatureName>.api.ts`
   - `<FeatureName>.hooks.ts`
   - `<FeatureName>.types.ts`
2. **State Management**:
   - Server state MUST use `@tanstack/react-query` (`useQuery`, `useMutation`).
   - Query keys must follow the array convention: `['<entityName>', '<scope>', id]`.
   - Always invalidate relevant query keys on successful mutations.
3. **UI Kit Primitives**:
   - Use design system tokens (`var(--brand-primary)`, `var(--space-4)`, `var(--radius-md)`).
   - Use components from `@university-erp/ui-kit` (`Button`, `Card`, `Modal`, `Table`, `Badge`, `PageHeader`).

---

## 3. Canonical Unit Testing Rules

1. **Test Placement**:
   - Tests belong in `tests/Unit/<portal-name>/<FeatureName>.unit.test.tsx`.
   - Never place loose `*.test.tsx` files inside `apps/<portal>/src/features/`.
2. **Standard Test Wrapper**:
   ```tsx
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import { render } from '@testing-library/react';
   import { MemoryRouter } from 'react-router-dom';
   import { describe, expect, it, vi } from 'vitest';

   // Mock Auth and API
   vi.mock('@university-erp/auth-sdk', () => ({
     useAuth: () => ({
       user: { id: 'test-user', role: 'Staff' },
       isAuthenticated: true,
     }),
   }));

   describe('FeatureName - Unit Testing', () => {
     it('renders initial view successfully', () => {
       const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
       const { container } = render(
         <QueryClientProvider client={queryClient}>
           <MemoryRouter>
             <FeaturePage />
           </MemoryRouter>
         </QueryClientProvider>
       );
       expect(container).toBeDefined();
     });
   });
   ```
3. **Apostrophe Safety**:
   - Always use double quotes `it.todo("...")` for test specifications containing words like `applicant's`, `user's`, or `system's`.

