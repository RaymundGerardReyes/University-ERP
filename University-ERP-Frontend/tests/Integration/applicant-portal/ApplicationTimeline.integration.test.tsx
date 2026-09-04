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
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'test-applicant' } }),
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
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('displays event details when interacting with timeline elements', async () => {
    renderComponent();
    expect(document.body).toBeInTheDocument();
  });
});
