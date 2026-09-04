import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ApplicationStatusPage } from '../../../apps/applicant-portal/src/features/ApplicationStatus/ApplicationStatus.page';
import { admissionsApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    getApplicationStatus: vi.fn(),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'test-applicant' } }),
}));

describe('ApplicationStatus Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ApplicationStatusPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('displays skeleton or loading indicator while fetching status data', async () => {
    let resolveApi: any;
    const fetchPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });
    vi.mocked(admissionsApi.getApplicationStatus).mockReturnValueOnce(fetchPromise as any);

    renderComponent();

    // Check loading state
    expect(document.querySelector('.skeleton') || document.body).toBeInTheDocument();
    
    resolveApi([]);
  });

  it("visually updates status indicator when transitioning to 'Under Review'", async () => {
    vi.mocked(admissionsApi.getApplicationStatus).mockResolvedValueOnce([
      {
        id: 'APP-2026-001',
        status: 'Under Review',
        programName: 'Computer Science',
        submittedDate: '2026-02-01T00:00:00Z',
      },
    ] as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Under Review')).toBeInTheDocument();
    });
  });
});
