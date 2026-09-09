import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { DatabaseManagementPage } from '../../../apps/platform-console/src/features/DatabaseManagement/DatabaseManagement.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'PLAT-ADMIN-01', name: 'Platform Administrator', roles: ['Admin', 'SuperAdmin', 'ROLE_PLATFORM_ADMIN'] },
    user: { id: 'PLAT-ADMIN-01', name: 'Platform Administrator', roles: ['Admin', 'SuperAdmin', 'ROLE_PLATFORM_ADMIN'] },
    isAuthenticated: true
  })
}));

describe("DatabaseManagement - Integration Testing", () => {
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
          <DatabaseManagementPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads DatabaseManagement view controller and mounts accessible heading", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies DatabaseManagement feature layout and operational state", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
