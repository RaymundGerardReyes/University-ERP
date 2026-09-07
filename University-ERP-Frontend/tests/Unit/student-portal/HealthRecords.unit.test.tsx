import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { HealthRecordsPage } from '../../../apps/student-portal/src/features/HealthRecords/HealthRecords.page';
import { healthCenterApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  healthCenterApi: {
    getAppointments: vi.fn().mockResolvedValue([
      { id: '1', appointmentType: 'General Checkup', date: '2026-02-01', provider: 'Dr. House', status: 'Completed' }
    ])
  }
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, identity: { id: 'STU-101' } })
}));

describe("HealthRecords - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders HealthRecords page heading", async () => {
    render(<QueryClientProvider client={queryClient}><MemoryRouter><HealthRecordsPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
