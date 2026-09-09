import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { SemesterBillingPage } from '../../../apps/finance-console/src/features/SemesterBilling/SemesterBilling.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-assessor', roles: ['ROLE_FINANCE_ASSESSOR'] }, isAuthenticated: true })
}));

describe("SemesterBilling - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders semester billing assessment page header", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SemesterBillingPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
