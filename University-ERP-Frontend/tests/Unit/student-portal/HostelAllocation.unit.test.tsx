import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { HostelAllocationPage } from '../../../apps/student-portal/src/features/HostelAllocation/HostelAllocation.page';

vi.mock('../../../apps/student-portal/src/features/HostelAllocation/HostelAllocation.hooks', () => ({
  useHostelAllocation: () => ({
    data: {
      hostelName: 'North Hall',
      roomNumber: '204-B',
      roomType: 'Double',
      status: 'Allocated',
      checkInDate: '2026-08-01',
      roommates: ['Bob Smith']
    },
    isLoading: false,
    isError: false
  })
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, identity: { id: 'STU-101' } })
}));

describe("HostelAllocation - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders HostelAllocation page heading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HostelAllocationPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
