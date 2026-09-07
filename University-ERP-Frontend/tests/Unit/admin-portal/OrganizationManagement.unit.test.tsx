import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { OrganizationManagementPage } from '../../../apps/admin-portal/src/features/OrganizationManagement/OrganizationManagement.page';

vi.mock('../../../apps/admin-portal/src/features/OrganizationManagement/OrganizationManagement.api', () => ({
  fetchOrganizationHierarchy: vi.fn().mockResolvedValue([
    { id: '1', name: 'College of Science', type: 'College', children: ['CS', 'Math'] },
    { id: '2', name: 'Main Library', type: 'Facility' }
  ]),
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'admin-1', roles: ['Admin'] } })
}));

describe("OrganizationManagement - Unit Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
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

  it("renders organization management page header", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
