import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { StudentBillingPage } from '../../../apps/finance-console/src/features/StudentBilling/StudentBilling.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-assessor', roles: ['ROLE_FINANCE_ASSESSOR'] }, isAuthenticated: true })
}));

describe("StudentBilling - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders student billing administration page header", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StudentBillingPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
