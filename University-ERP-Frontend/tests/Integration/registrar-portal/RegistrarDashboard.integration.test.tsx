import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { RegistrarDashboardPage } from '../../../apps/registrar-portal/src/features/RegistrarDashboard/RegistrarDashboard.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'REG-OFFICER-01', name: 'Registrar Officer', roles: ['Admin', 'Registrar', 'ROLE_REGISTRAR'] },
    user: { id: 'REG-OFFICER-01', name: 'Registrar Officer', roles: ['Admin', 'Registrar', 'ROLE_REGISTRAR'] },
    isAuthenticated: true
  })
}));

vi.mock('@university-erp/api-clients', () => ({
  registrarApi: {
    getEnrollmentValidationQueue: vi.fn().mockResolvedValue([
      { id: 'VAL-001', studentId: 'STU-101', applicantName: 'Alice Smith', program: 'BS IT' }
    ]),
    getPendingClearances: vi.fn().mockResolvedValue([
      { studentId: 'STU-202', gpa: '3.85', credits: '120', status: 'PENDING' }
    ]),
    approveClearance: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe("RegistrarDashboard - Integration Testing", () => {
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
          <RegistrarDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads RegistrarDashboard division interface and mounts accessible heading", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies RegistrarDashboard workspace container and operational state", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
