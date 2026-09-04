import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CrossEnrollmentPage } from '../../../apps/student-portal/src/features/CrossEnrollment/CrossEnrollment.page';
import { crossEnrollmentApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  crossEnrollmentApi: {
    getRequests: vi.fn(),
    submitRequest: vi.fn(),
    searchEquivalentCourses: vi.fn(),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student' } }),
}));

describe('CrossEnrollment Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CrossEnrollmentPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders cross enrollment page header correctly', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
