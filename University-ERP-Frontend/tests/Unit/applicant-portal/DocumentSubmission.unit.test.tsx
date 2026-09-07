import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DocumentSubmissionPage } from '../../../apps/applicant-portal/src/features/DocumentSubmission/DocumentSubmission.page';
import { admissionsApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    getApplicantJourney: vi.fn().mockResolvedValue({
      id: 'app-1',
      documents: [
        { id: 'doc-1', name: 'Official Transcript', status: 'Pending', fileUrl: 'https://example.com/doc.pdf', mimeType: 'application/pdf' }
      ],
      timeline: []
    }),
    uploadDocument: vi.fn().mockResolvedValue({ success: true }),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'applicant-123' },
    user: { id: 'applicant-123' }
  }),
}));

describe("DocumentSubmission - Unit Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DocumentSubmissionPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("renders document submission page header", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it("renders uploaded documents table with document rows", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Official Transcript')).toBeInTheDocument();
    });
  });
});
