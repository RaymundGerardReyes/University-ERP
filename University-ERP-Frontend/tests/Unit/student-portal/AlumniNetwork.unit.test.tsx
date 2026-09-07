import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AlumniNetworkPage } from '../../../apps/student-portal/src/features/AlumniNetwork/AlumniNetwork.page';
import { alumniApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  alumniApi: {
    getAlumniStatus: vi.fn().mockResolvedValue({
      graduationYear: '2026',
      chapter: 'Regional Chapter',
      alumniStatus: 'Active Member',
      benefitsActive: true
    })
  }
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    user: { id: 'STU-101' },
    identity: { id: 'STU-101' }
  })
}));

describe("AlumniNetwork - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders AlumniNetwork page heading", async () => {
    render(<QueryClientProvider client={queryClient}><MemoryRouter><AlumniNetworkPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
