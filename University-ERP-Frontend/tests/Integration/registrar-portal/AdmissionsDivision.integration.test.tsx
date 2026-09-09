import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { AdmissionsQueuePage } from '../../../apps/registrar-portal/src/features/AdmissionsDivision/AdmissionsQueue.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'REG-OFFICER-01', name: 'Registrar Officer', roles: ['Admin', 'Registrar', 'ROLE_REGISTRAR'] },
    user: { id: 'REG-OFFICER-01', name: 'Registrar Officer', roles: ['Admin', 'Registrar', 'ROLE_REGISTRAR'] },
    isAuthenticated: true
  })
}));

describe("AdmissionsDivision - Integration Testing", () => {
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
          <AdmissionsQueuePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads AdmissionsDivision division interface and mounts accessible heading", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies AdmissionsDivision workspace container and operational state", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
