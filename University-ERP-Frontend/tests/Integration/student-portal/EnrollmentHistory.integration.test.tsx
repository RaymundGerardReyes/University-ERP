import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EnrollmentHistoryPage } from '../../../apps/student-portal/src/features/EnrollmentHistory/EnrollmentHistory.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student' } }),
}));

describe('EnrollmentHistory Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnrollmentHistoryPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders enrollment history page heading', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
