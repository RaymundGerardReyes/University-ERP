import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EnrollmentActivationPage } from '../../../apps/registrar-portal/src/features/Admissions/EnrollmentActivation.page';

vi.mock('../../../apps/registrar-portal/src/features/AdmissionsDivision/Admissions.api', () => ({
  fetchAdmissionsQueue: vi.fn().mockResolvedValue([
    { id: 'ADM-2026-901', applicantName: 'James Wilson', program: 'BS Architecture', status: 'FINANCIAL_CLEARANCE' }
  ]),
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'reg-1', roles: ['Registrar'] } })
}));

describe("Admissions - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders enrollment activation queue heading", async () => {
    render(<QueryClientProvider client={queryClient}><MemoryRouter><EnrollmentActivationPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
