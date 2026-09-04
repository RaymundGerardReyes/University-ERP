import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AdmissionStatusPage } from '../../../apps/applicant-portal/src/features/AdmissionStatus/AdmissionStatus.page';
import { admissionsApi } from '@university-erp/api-clients';

// Mock the API client and Auth SDK
vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    getApplicationStatus: vi.fn(),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'test-applicant' } }),
}));

describe('AdmissionStatus Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdmissionStatusPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("displays 'Accepted' status when data is successfully fetched", async () => {
    vi.mocked(admissionsApi.getApplicationStatus).mockResolvedValueOnce([
      {
        id: 'APP-101',
        programName: 'Computer Science',
        status: 'Accepted',
        submittedDate: '2026-01-15T00:00:00Z',
      },
    ] as any);

    renderComponent();

    expect(await screen.findByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('displays an error state when the API fails to fetch status', async () => {
    vi.mocked(admissionsApi.getApplicationStatus).mockRejectedValueOnce(new Error('Network Error'));

    renderComponent();

    expect(await screen.findByText(/Status Unavailable/i)).toBeInTheDocument();
  });
});
