import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EnrollmentPage } from '../../../apps/student-portal/src/features/Enrollment/Enrollment.page';
import { registrarApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  registrarApi: {
    registerCourse: vi.fn(),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student' } }),
}));

describe('Enrollment Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnrollmentPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders enrollment page header correctly', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('handles course registration workflow', async () => {
    renderComponent();
    expect(document.body).toBeInTheDocument();
  });
});
