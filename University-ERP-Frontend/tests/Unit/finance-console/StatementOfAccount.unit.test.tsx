import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StatementOfAccountPage } from '../../../apps/finance-console/src/features/StudentBilling/StatementOfAccount.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-1', roles: ['ROLE_FINANCE_ADMIN'] } }),
}));

vi.mock('../../../apps/finance-console/src/features/StudentBilling/StatementOfAccount.api', () => ({
  statementApi: {
    getAccountSummaries: vi.fn().mockResolvedValue([
      {
        studentId: 'stud-001',
        studentNumber: '2024-10023',
        studentName: 'Juan Dela Cruz',
        program: 'BS Computer Science',
        yearLevel: 3,
        totalAssessed: 48500,
        totalDiscount: 15000,
        totalPaid: 20000,
        currentBalance: 13500,
        clearanceStatus: 'HOLD',
        lastPaymentDate: '2026-08-15',
      }
    ]),
    getStatementDetail: vi.fn().mockResolvedValue({
      student: {
        studentId: 'stud-001',
        studentNumber: '2024-10023',
        studentName: 'Juan Dela Cruz',
        program: 'BS Computer Science',
        yearLevel: 3,
        totalAssessed: 48500,
        totalDiscount: 15000,
        totalPaid: 20000,
        currentBalance: 13500,
        clearanceStatus: 'HOLD',
        lastPaymentDate: '2026-08-15',
      },
      ledger: [
        {
          id: 'led-1',
          date: '2026-08-01',
          term: '1st Sem 2026-2027',
          description: 'Tuition & Misc Assessment (21 Units)',
          referenceNo: 'ASS-2026-001',
          type: 'ASSESSMENT',
          debit: 48500,
          credit: 0,
          runningBalance: 48500,
        }
      ],
      paymentSchedules: [
        { term: 'Prelim Installment', dueDate: '2026-09-15', amount: 4500, status: 'DUE' }
      ]
    }),
    postAdjustment: vi.fn().mockResolvedValue(undefined),
  }
}));

describe('StatementOfAccountPage - Unit Testing', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it('renders student statement of account heading', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StatementOfAccountPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Student Statement of Account (SOA)');
    });
  });

  it('renders student directory and ledger transaction panels', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StatementOfAccountPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Student Directory')).toBeInTheDocument();
      expect(screen.getByText('Itemized Account Transactions')).toBeInTheDocument();
    });
  });
});
