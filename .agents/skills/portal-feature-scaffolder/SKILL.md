---
name: portal-feature-scaffolder
description: >-
  Scaffolds a complete Domain-Based Modular Architecture (DBMA) vertical feature slice (page, api, hooks, types) inside any of the 14 frontend portals and generates its companion unit test under tests/Unit/. Use when the user asks to add, generate, or scaffold a new frontend feature.
---

# Portal Feature Scaffolder Skill

This skill provides the standard procedure and code templates for scaffolding a complete, production-ready DBMA vertical feature slice across any of the 14 frontend applications in `University-ERP-Frontend/apps/`.

---

## 1. Target Portal Selection

Choose the destination portal under `University-ERP-Frontend/apps/`:
- `admin-portal`: System configuration, audit, and institution admin features.
- `admissions-portal`: Staff applicant review, case management, and interview scoring.
- `applicant-portal`: Prospective student application flow and document submission.
- `faculty-portal`: Course section management, advising, and grade submission.
- `finance-console`: Cashiering, student billing, tuition assessment, and payroll.
- `governance-console`: Quality accreditation, institutional policies, and compliance.
- `identity-portal`: User onboarding, MFA, password reset, and session control.
- `library-portal`: Circulation, catalog search, fines, and reservations.
- `lms-web`: Course syllabus, assignments, quizzes, and grade sync.
- `payment-gateway`: Hosted checkout and banking callbacks.
- `platform-console`: Tenant management, database ops, and system logs.
- `registrar-portal`: Academic records, add/drop oversight, waitlists, and graduation.
- `security-portal`: Central security administration and audit logging.
- `student-portal`: Enrolled student self-service, registration, and timetable.

---

## 2. Directory Structure

Target feature path:
`University-ERP-Frontend/apps/<portal-name>/src/features/<FeatureName>/`

Create four standard files:
1. `<FeatureName>.types.ts`
2. `<FeatureName>.api.ts`
3. `<FeatureName>.hooks.ts`
4. `<FeatureName>.page.tsx`

And its companion unit test:
`University-ERP-Frontend/tests/Unit/<portal-name>/<FeatureName>.unit.test.tsx`

---

## 3. Standard Code Templates

### A. `<FeatureName>.types.ts`
```ts
export interface [FeatureName]Item {
  id: string;
  code: string;
  name: string;
  status: 'Pending' | 'Active' | 'Archived';
  createdAt: string;
}

export interface Create[FeatureName]Payload {
  name: string;
  code: string;
}
```

### B. `<FeatureName>.api.ts`
```ts
import { apiClient } from '@university-erp/api-clients';
import { [FeatureName]Item, Create[FeatureName]Payload } from './[FeatureName].types';

export const [featureName]Api = {
  getAll: async (): Promise<[FeatureName]Item[]> => {
    const response = await apiClient.get<[FeatureName]Item[]>('/api/v1/[domain]/[endpoint]');
    return response.data;
  },

  getById: async (id: string): Promise<[FeatureName]Item> => {
    const response = await apiClient.get<[FeatureName]Item>(`/api/v1/[domain]/[endpoint]/${id}`);
    return response.data;
  },

  create: async (payload: Create[FeatureName]Payload): Promise<[FeatureName]Item> => {
    const response = await apiClient.post<[FeatureName]Item>('/api/v1/[domain]/[endpoint]', payload);
    return response.data;
  },
};
```

### C. `<FeatureName>.hooks.ts`
```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { [featureName]Api } from './[FeatureName].api';
import { Create[FeatureName]Payload } from './[FeatureName].types';

const QUERY_KEY = ['[featureName]Items'];

export function use[FeatureName]Items() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => [featureName]Api.getAll(),
  });
}

export function useCreate[FeatureName]() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Create[FeatureName]Payload) => [featureName]Api.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
```

### D. `<FeatureName>.page.tsx`
```tsx
import React, { useState } from 'react';
import { PageHeader, Card, Table, Button, Badge, Modal } from '@university-erp/ui-kit';
import { use[FeatureName]Items, useCreate[FeatureName] } from './[FeatureName].hooks';

export const [FeatureName]Page: React.FC = () => {
  const { data: items, isLoading, isError } = use[FeatureName]Items();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />;
  }

  if (isError) {
    return <div className="error-banner">Failed to load records.</div>;
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="[Feature Title]"
        subtitle="Manage and oversee [feature domain] records."
        action={
          <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
            Add New Record
          </Button>
        }
      />
      <Card>
        <Table
          data={items || []}
          columns={[
            { key: 'code', title: 'Code' },
            { key: 'name', title: 'Name' },
            {
              key: 'status',
              title: 'Status',
              render: (row) => (
                <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>
                  {row.status}
                </Badge>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
```

---

## 4. Companion Unit Test Standard

Target: `University-ERP-Frontend/tests/Unit/<portal-name>/<FeatureName>.unit.test.tsx`

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { [FeatureName]Page } from '../../../apps/<portal-name>/src/features/<FeatureName>/[FeatureName].page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    user: { id: 'test-user', role: 'Staff' },
    isAuthenticated: true,
  }),
}));

vi.mock('../../../apps/<portal-name>/src/features/<FeatureName>/[FeatureName].hooks', () => ({
  use[FeatureName]Items: () => ({
    data: [
      { id: '1', code: 'REC-001', name: 'Sample Record', status: 'Active', createdAt: '2026-09-01' },
    ],
    isLoading: false,
    isError: false,
  }),
  useCreate[FeatureName]: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

describe("[FeatureName]Page - Unit Testing", () => {
  it("renders page header and data table correctly", () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <[FeatureName]Page />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('[Feature Title]')).toBeInTheDocument();
    expect(screen.getByText('REC-001')).toBeInTheDocument();
    expect(screen.getByText('Sample Record')).toBeInTheDocument();
  });
});
```
