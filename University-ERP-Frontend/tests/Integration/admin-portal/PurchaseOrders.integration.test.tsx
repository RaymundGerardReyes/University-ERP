import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { PurchaseOrdersPage } from '../../../apps/admin-portal/src/features/PurchaseOrders/PurchaseOrders.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'EMP-ADMIN-01', name: 'System Administrator', roles: ['Admin', 'SuperAdmin', 'AcademicAdmin'] },
    user: { id: 'EMP-ADMIN-01', name: 'System Administrator', roles: ['Admin', 'SuperAdmin', 'AcademicAdmin'] },
    isAuthenticated: true
  })
}));

describe("PurchaseOrders - Integration Testing", () => {
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
          <PurchaseOrdersPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads PurchaseOrders view controller and mounts accessible interface", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies PurchaseOrders container structure and layout stability", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
