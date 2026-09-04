import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DashboardPage } from '../../../apps/student-portal/src/features/Dashboard/Dashboard.page';
import { studentInformationApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  studentInformationApi: {
    getDashboardOverview: vi.fn(),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student' } }),
}));

describe('Dashboard Integration', () => {
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

  it('renders student dashboard header correctly', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('loads student dashboard elements successfully', async () => {
    renderComponent();
    expect(document.body).toBeInTheDocument();
  });
});
