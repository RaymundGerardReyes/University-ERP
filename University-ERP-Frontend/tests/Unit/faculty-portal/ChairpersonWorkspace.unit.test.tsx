import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EvaluationQueuePage } from '../../../apps/faculty-portal/src/features/ChairpersonWorkspace/EvaluationQueue.page';
import { facultyAdmissionsApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  facultyAdmissionsApi: {
    getPendingApplications: vi.fn().mockResolvedValue([
      { id: 'app-1', applicantName: 'Jane Smith', program: 'BSCS', gpa: 3.9 }
    ]),
    approveApplication: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe("ChairpersonWorkspace - Unit Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EvaluationQueuePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("renders chairperson evaluation queue page", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it("displays applicant evaluation cards", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });
});
