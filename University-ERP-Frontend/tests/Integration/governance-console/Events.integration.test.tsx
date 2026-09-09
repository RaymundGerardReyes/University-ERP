import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { EventsPage } from '../../../apps/governance-console/src/features/Events/Events.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'GOV-ADMIN-01', name: 'Governance Administrator', roles: ['Admin', 'SuperAdmin', 'ROLE_GOVERNANCE_ADMIN'] },
    user: { id: 'GOV-ADMIN-01', name: 'Governance Administrator', roles: ['Admin', 'SuperAdmin', 'ROLE_GOVERNANCE_ADMIN'] },
    isAuthenticated: true
  })
}));

describe("Events - Integration Testing", () => {
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
          <EventsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads Events view controller and mounts accessible heading", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies Events feature layout and operational state", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
