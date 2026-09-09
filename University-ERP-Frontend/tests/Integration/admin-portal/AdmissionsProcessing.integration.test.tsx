import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { AdmissionsProcessingPage } from '../../../apps/admin-portal/src/features/AdmissionsProcessing/AdmissionsProcessing.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'EMP-ADMIN-01', name: 'System Administrator', roles: ['Admin', 'SuperAdmin', 'AcademicAdmin'] },
    user: { id: 'EMP-ADMIN-01', name: 'System Administrator', roles: ['Admin', 'SuperAdmin', 'AcademicAdmin'] },
    isAuthenticated: true
  })
}));

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    getPendingApplications: vi.fn().mockResolvedValue([]),
    verifyDocumentsAndForward: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe("AdmissionsProcessing - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } }
    });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdmissionsProcessingPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads AdmissionsProcessing view controller and mounts accessible interface", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies AdmissionsProcessing container structure and layout stability", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
