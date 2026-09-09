import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { PayrollPage } from '../../../apps/finance-console/src/features/Payroll/Payroll.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-admin', roles: ['ROLE_FINANCE_ADMIN'] }, isAuthenticated: true })
}));

describe("Payroll - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders payroll management page header and payslip trigger", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PayrollPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Generate New Payslip")).toBeInTheDocument();
  });
});
