import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AdmissionQueuePage } from '../../../apps/faculty-portal/src/features/SecretaryWorkspace/AdmissionQueue.page';
import { facultyAdmissionsApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  facultyAdmissionsApi: {
    getPendingApplications: vi.fn().mockResolvedValue([
      { id: 'app-2', applicantName: 'Bob Williams', submittedDate: '2026-01-10' }
    ]),
    approveApplication: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe("SecretaryWorkspace - Unit Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdmissionQueuePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("renders secretary admissions queue heading", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it("displays applicant queue cards", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Bob Williams')).toBeInTheDocument();
    });
  });
});
