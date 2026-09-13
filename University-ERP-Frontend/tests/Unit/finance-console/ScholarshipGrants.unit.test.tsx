import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ScholarshipGrantsPage } from '../../../apps/finance-console/src/features/StudentBilling/ScholarshipGrants.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-1', roles: ['ROLE_FINANCE_ADMIN'] } }),
}));

describe('ScholarshipGrantsPage - Unit Testing', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it('renders the scholarships & financial grants workbench heading', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ScholarshipGrantsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Scholarships & Financial Grants');
    });
  });

  it('renders application queue and summary cards', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ScholarshipGrantsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Application Queue')).toBeInTheDocument();
      expect(screen.getByText('Total Schemes Active')).toBeInTheDocument();
      expect(screen.getByText('Approved Grants')).toBeInTheDocument();
    });
  });
});

