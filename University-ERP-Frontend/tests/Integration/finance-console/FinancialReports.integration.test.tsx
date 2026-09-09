import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { FinancialReportsPage } from '../../../apps/finance-console/src/features/FinancialReports/FinancialReports.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-admin', roles: ['ROLE_FINANCE_ADMIN'] }, isAuthenticated: true })
}));

describe("FinancialReports - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders financial reports page heading and export trigger", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FinancialReportsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Export Financial Pack (PDF)")).toBeInTheDocument();
  });
});
