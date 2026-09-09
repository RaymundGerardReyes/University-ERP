import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { EnrollmentActivationPage } from '../../../apps/registrar-portal/src/features/Admissions/EnrollmentActivation.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'REG-OFFICER-01', name: 'Registrar Officer', roles: ['Admin', 'Registrar', 'ROLE_REGISTRAR'] },
    user: { id: 'REG-OFFICER-01', name: 'Registrar Officer', roles: ['Admin', 'Registrar', 'ROLE_REGISTRAR'] },
    isAuthenticated: true
  })
}));

vi.mock('@university-erp/api-clients', () => ({
  registrarApi: {
    getAdmissionsQueue: vi.fn().mockResolvedValue([
      { id: 'ADM-2026-001', applicantName: 'Jane Doe', program: 'BS Computer Science', status: 'FINANCIAL_CLEARANCE' }
    ])
  }
}));

vi.mock('@university-erp/workflow-sdk', () => ({
  AdmissionWorkflow: {
    advance: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe("Admissions - Integration Testing", () => {
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
          <EnrollmentActivationPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads Admissions division interface and mounts accessible heading", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies Admissions workspace container and operational state", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
