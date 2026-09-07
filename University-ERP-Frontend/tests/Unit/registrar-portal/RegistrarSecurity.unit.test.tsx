import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { RecordAccessAuditPage } from '../../../apps/registrar-portal/src/features/RegistrarSecurity/RecordAccessAudit.page';

vi.mock('../../../apps/registrar-portal/src/features/RegistrarSecurity/Security.api', () => ({
  fetchAuditLogs: vi.fn().mockResolvedValue([
    { id: '1', actor: 'Registrar Admin', action: 'VIEW_RECORD', target: 'STU-001', timestamp: '2026-01-01' }
  ]),
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'reg-1', roles: ['Registrar'] } })
}));

describe("RegistrarSecurity - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders record access audit heading", async () => {
    render(<QueryClientProvider client={queryClient}><MemoryRouter><RecordAccessAuditPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
