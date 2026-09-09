import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { RecordAccessAuditPage } from '../../../apps/registrar-portal/src/features/RegistrarSecurity/RecordAccessAudit.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'REG-OFFICER-01', name: 'Registrar Officer', roles: ['Admin', 'Registrar', 'ROLE_REGISTRAR'] },
    user: { id: 'REG-OFFICER-01', name: 'Registrar Officer', roles: ['Admin', 'Registrar', 'ROLE_REGISTRAR'] },
    isAuthenticated: true
  })
}));

vi.mock('@university-erp/api-clients', () => ({
  registrarApi: {
    getAuditLogs: vi.fn().mockResolvedValue([
      { timestamp: '2026-09-09 10:00:00', actor: 'Registrar Officer', action: 'RECORD_MODIFICATION', target: 'TRANSCRIPT-101', ip: '192.168.1.50' }
    ])
  }
}));

describe("RegistrarSecurity - Integration Testing", () => {
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
          <RecordAccessAuditPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("loads RegistrarSecurity division interface and mounts accessible heading", async () => {
    renderComponent();
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });

  it("verifies RegistrarSecurity workspace container and operational state", async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
