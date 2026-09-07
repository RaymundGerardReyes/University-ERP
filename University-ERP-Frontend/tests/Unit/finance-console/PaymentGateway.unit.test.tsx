import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PaymentGatewayPage } from '../../../apps/finance-console/src/features/PaymentGateway/PaymentGateway.page';
import { financePaymentSessionApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  financePaymentSessionApi: {
    getAllSessions: vi.fn().mockResolvedValue([
      { sessionId: 'SESS-101', applicantId: 'APP-101', amount: 50, currency: 'USD', status: 'Active', createdAt: '2026-01-01' }
    ]),
    reconcileSession: vi.fn().mockResolvedValue({ success: true })
  }
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-1', roles: ['Finance'] } })
}));

describe("PaymentGateway - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders payment gateway page heading", async () => {
    render(<QueryClientProvider client={queryClient}><MemoryRouter><PaymentGatewayPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
