import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StudentBillingPage } from '../../../apps/finance-console/src/features/StudentBilling/StudentBilling.page';

vi.mock('../../../apps/finance-console/src/features/StudentBilling/StudentBilling.hooks', () => ({
  useStudentBillings: () => ({
    data: [
      { id: 'INV-101', studentId: 'STU-101', totalAmount: 1500, paidAmount: 1500, outstandingBalance: 0, description: 'Tuition', status: 'PAID', issuedOnUtc: '2026-10-01' }
    ],
    isLoading: false,
    isError: false
  })
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-1', roles: ['Finance'] } })
}));

describe("StudentBilling - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders student billing page heading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StudentBillingPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
