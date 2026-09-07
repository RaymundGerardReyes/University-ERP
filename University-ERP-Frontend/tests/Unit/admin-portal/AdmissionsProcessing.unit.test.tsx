import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AdmissionsWorkspacePage } from '../../../apps/admin-portal/src/features/AdmissionsProcessing/AdmissionsWorkspace.page';
import { admissionsApi } from '@university-erp/api-clients';

const mockUseAuth = vi.fn();
vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => mockUseAuth()
}));

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    getPendingApplications: vi.fn().mockResolvedValue([
      { id: 'APP-01', applicantName: 'John Doe', applicationFeeStatus: 'Paid', status: 'Pending' }
    ]),
    verifyDocumentsAndForward: vi.fn(),
    submitAcademicEvaluation: vi.fn(),
    generateStudentIdentityAndEnroll: vi.fn()
  }
}));

describe("AdmissionsProcessing - Unit Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: { roles: ['Secretary'] } });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdmissionsWorkspacePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("should render the AdmissionsWorkspace shell correctly", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Admissions Processing Workspace')).toBeInTheDocument();
    });
  });
});
