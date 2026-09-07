import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CareerDashboardPage } from '../../../apps/student-portal/src/features/CareerDashboard/CareerDashboard.page';
import { careerApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  careerApi: {
    getJobPostings: vi.fn(),
  },
}));

describe('CareerDashboard Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CareerDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('loads career dashboard correctly', async () => {
    (careerApi.getJobPostings as any).mockResolvedValue([
      { id: '1', jobTitle: 'Software Engineer', companyName: 'Acme Corp', location: 'Remote', deadline: '2026-12-31', tags: ['Tech'] }
    ]);
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
