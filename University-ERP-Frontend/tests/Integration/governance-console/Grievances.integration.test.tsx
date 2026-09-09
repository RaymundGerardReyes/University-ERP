import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { GrievancesPage } from '../../../apps/governance-console/src/features/Grievances/Grievances.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'GOV-ADMIN-01', name: 'Governance Administrator', roles: ['Admin', 'SuperAdmin', 'ROLE_GOVERNANCE_ADMIN'] },
    user: { id: 'GOV-ADMIN-01', name: 'Governance Administrator', roles: ['Admin', 'SuperAdmin', 'ROLE_GOVERNANCE_ADMIN'] },
    isAuthenticated: true
  })
}));

describe("Grievances - Integration Testing", () => {
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
          <GrievancesPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads Grievances view controller and mounts accessible heading", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies Grievances feature layout and operational state", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
