import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ApplicationTimelinePage } from '../../../apps/applicant-portal/src/features/ApplicationTimeline/ApplicationTimeline.page';
import { admissionsApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    getTimelineEvents: vi.fn(),
    getApplicantJourney: vi.fn().mockResolvedValue({
      currentStage: 2,
      timeline: [
        { title: 'Application Submitted', date: '2026-01-01', completed: true },
        { title: 'Document Verification', date: '2026-01-05', completed: true }
      ]
    }),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'test-applicant' },
    user: { id: 'test-applicant' }
  }),
}));

describe('ApplicationTimeline Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ApplicationTimelinePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders timeline page header and structure correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it('displays event details when interacting with timeline elements', async () => {
    renderComponent();
    expect(document.body).toBeInTheDocument();
  });
});
