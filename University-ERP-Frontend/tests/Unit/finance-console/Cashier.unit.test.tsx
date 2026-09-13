import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PaymentGatewayPage } from '../../../apps/finance-console/src/features/Cashier/PaymentGateway.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-1', roles: ['Cashier'] } })
}));

describe("Cashier - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders cashier payment gateway page heading", async () => {
    render(<QueryClientProvider client={queryClient}><MemoryRouter><PaymentGatewayPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it("calls /finance/cashier/queue when getQueue is invoked", async () => {
    const { apiClient } = await import('@university-erp/api-clients');
    const { cashierTerminalApi } = await import('../../../apps/finance-console/src/features/Cashier/Cashier.api');

    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: [
        {
          transactionToken: 'TX-CASH-101',
          referenceId: 'STU-001',
          payerName: 'John Doe',
          purpose: 'Over-the-counter Cash Payment',
          amount: 5000,
          status: 'PENDING',
          issuedAt: '2026-09-01T08:00:00Z'
        }
      ]
    } as any);

    const queue = await cashierTerminalApi.getQueue();

    expect(apiClient.get).toHaveBeenCalledWith('/finance/cashier/queue');
    expect(queue).toHaveLength(1);
    expect(queue[0].transactionToken).toBe('TX-CASH-101');
  });

  it("calls /finance/cashier/process when processPayment is invoked", async () => {
    const { apiClient } = await import('@university-erp/api-clients');
    const { cashierTerminalApi } = await import('../../../apps/finance-console/src/features/Cashier/Cashier.api');

    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: { success: true, transactionId: 'TX-DEP-99', status: 'COMPLETED' }
    } as any);

    const payload = {
      referenceId: 'STU-001',
      amount: 5000,
      transactionToken: 'TX-CASH-101',
      remarks: 'Paid at counter terminal'
    };

    await cashierTerminalApi.processPayment(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/finance/cashier/process', payload);
  });
});
