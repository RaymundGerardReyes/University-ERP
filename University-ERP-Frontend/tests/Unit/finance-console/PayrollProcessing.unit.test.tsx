import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PayrollProcessingPage } from '../../../apps/finance-console/src/features/PayrollProcessing/PayrollProcessing.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-1', roles: ['Finance'] } })
}));

describe("PayrollProcessing - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders payroll processing page heading", async () => {
    render(<QueryClientProvider client={queryClient}><MemoryRouter><PayrollProcessingPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
