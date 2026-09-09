import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { GuidanceSessionsPage } from '../../../apps/student-portal/src/features/GuidanceSessions/GuidanceSessions.page';

vi.mock('@university-erp/api-clients', () => ({
  guidanceApi: {
    getSessions: vi.fn().mockResolvedValue([
      { id: '1', sessionType: 'Academic', date: '2026-02-01', counselorName: 'Dr. Lopez', notes: 'Degree progress check.', status: 'Scheduled', time: '10:00 AM' }
    ])
  }
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, identity: { id: 'STU-101' }, isAuthenticated: true })
}));

describe("GuidanceSessions - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders guidance counseling page heading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GuidanceSessionsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
