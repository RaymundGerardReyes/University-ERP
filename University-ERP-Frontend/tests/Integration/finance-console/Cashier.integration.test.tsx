import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { PaymentGatewayPage } from '../../../apps/finance-console/src/features/Cashier/PaymentGateway.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-cashier', roles: ['ROLE_FINANCE_CASHIER'] }, isAuthenticated: true })
}));

describe("Cashier - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders cashier terminal heading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PaymentGatewayPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
