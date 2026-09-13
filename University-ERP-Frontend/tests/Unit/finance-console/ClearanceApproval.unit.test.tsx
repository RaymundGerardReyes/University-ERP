import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ClearanceApprovalPage } from '../../../apps/finance-console/src/features/Cashier/ClearanceApproval.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-1', roles: ['ROLE_FINANCE_ADMIN'] } }),
}));

vi.mock('../../../apps/finance-console/src/features/Cashier/ClearanceApproval.api', () => ({
  clearanceApi: {
    getCandidates: vi.fn().mockResolvedValue([
      {
        id: 'clr-001',
        studentNumber: '2022-00192',
        studentName: 'Angela Gomez',
        program: 'BS Accountancy',
        graduationTerm: 'Midyear 2026',
        outstandingBalance: 0,
        unreturnedAssetsCount: 0,
        libraryFines: 0,
        financeStatus: 'CLEARED',
        clearanceSignOffDate: '2026-09-10',
        signOffOfficer: 'Eleanor Vance (Chief Cashier)',
      }
    ]),
    approveClearance: vi.fn().mockResolvedValue({}),
    rejectClearance: vi.fn().mockResolvedValue({}),
  }
}));

describe('ClearanceApprovalPage - Unit Testing', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it('renders graduation financial clearance heading', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ClearanceApprovalPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Graduation Financial Clearance');
    });
  });

  it('renders clearance candidate metrics and dossier panel', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ClearanceApprovalPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Pending Finance Sign-off')).toBeInTheDocument();
      expect(screen.getByText('Finance Cleared')).toBeInTheDocument();
      expect(screen.getByText('Clearance Dossier')).toBeInTheDocument();
    });
  });
});
