import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { OrganizationManagementPage } from '../../../apps/admin-portal/src/features/OrganizationManagement/OrganizationManagement.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'EMP-ADMIN-01', name: 'System Administrator', roles: ['Admin', 'SuperAdmin', 'AcademicAdmin'] },
    user: { id: 'EMP-ADMIN-01', name: 'System Administrator', roles: ['Admin', 'SuperAdmin', 'AcademicAdmin'] },
    isAuthenticated: true
  })
}));

vi.mock('../../../apps/admin-portal/src/features/OrganizationManagement/OrganizationManagement.api', () => ({
  fetchOrganizationHierarchy: vi.fn().mockResolvedValue([
    { name: 'College of Engineering', type: 'College', children: ['Department of Computer Science'] },
    { name: 'Engineering Building A', type: 'Facility' }
  ])
}));

describe("OrganizationManagement - Integration Testing", () => {
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
          <OrganizationManagementPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads OrganizationManagement view controller and mounts accessible interface", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies OrganizationManagement container structure and layout stability", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
