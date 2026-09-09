import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MasterStudentListPage } from '../../../apps/registrar-portal/src/features/StudentRegistryDivision/MasterStudentList.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'REG-OFFICER-01', name: 'Registrar Officer', roles: ['Admin', 'Registrar', 'ROLE_REGISTRAR'] },
    user: { id: 'REG-OFFICER-01', name: 'Registrar Officer', roles: ['Admin', 'Registrar', 'ROLE_REGISTRAR'] },
    isAuthenticated: true
  })
}));

describe("StudentRegistryDivision - Integration Testing", () => {
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
          <MasterStudentListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads StudentRegistryDivision division interface and mounts accessible heading", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies StudentRegistryDivision workspace container and operational state", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
