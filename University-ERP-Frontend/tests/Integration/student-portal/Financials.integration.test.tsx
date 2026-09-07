import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { FinancialsPage } from '../../../apps/student-portal/src/features/Financials/Financials.page';

vi.mock('../../../apps/student-portal/src/features/Financials/Financials.api', () => ({
  financialsApi: {
    getCurrentTermInvoice: vi.fn().mockResolvedValue({
      invoiceId: 'INV-100',
      termId: 'TERM-FALL-2026',
      amountDue: 500,
      amountPaid: 0,
      dueDate: '2026-10-01',
      status: 'UNPAID',
      breakdown: [{ category: 'Tuition', amount: 500 }],
      installments: []
    }),
  }
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student' } }),
}));

describe('Financials Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FinancialsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders financials page heading correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
