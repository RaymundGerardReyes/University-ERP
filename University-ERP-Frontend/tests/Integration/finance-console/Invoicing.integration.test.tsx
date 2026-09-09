import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { InvoicingPage } from '../../../apps/finance-console/src/features/Invoicing/Invoicing.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-admin', roles: ['ROLE_FINANCE_ADMIN'] }, isAuthenticated: true })
}));

describe("Invoicing - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders Invoicing page header and issue invoice trigger", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <InvoicingPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Issue New Invoice")).toBeInTheDocument();
  });
});
