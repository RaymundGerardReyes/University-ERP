import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { BudgetingPage } from '../../../apps/finance-console/src/features/Budgeting/Budgeting.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-admin', roles: ['ROLE_FINANCE_ADMIN'] }, isAuthenticated: true })
}));

describe("Budgeting - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders Budgeting page header and allocation trigger", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BudgetingPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Add Department Allocation")).toBeInTheDocument();
  });
});
