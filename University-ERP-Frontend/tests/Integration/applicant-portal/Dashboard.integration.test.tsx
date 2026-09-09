import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DashboardPage } from '../../../apps/applicant-portal/src/features/Dashboard/Dashboard.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'applicant-123', name: 'Alex Doe' } }),
  useAuth: () => ({
    identity: { id: 'applicant-123', name: 'Alex Doe' },
    user: { id: 'applicant-123', name: 'Alex Doe' }
  }),
}));

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    getApplicantJourney: vi.fn().mockResolvedValue({
      applicantName: 'Alex Doe',
      currentStage: 2,
      applicationFeeStatus: 'Paid',
      documents: [],
      timeline: []
    })
  }
}));

describe('Applicant Dashboard Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders applicant dashboard page correctly', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
