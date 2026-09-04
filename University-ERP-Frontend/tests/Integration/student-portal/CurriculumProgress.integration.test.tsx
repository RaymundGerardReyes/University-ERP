import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CurriculumProgressPage } from '../../../apps/student-portal/src/features/CurriculumProgress/CurriculumProgress.page';
import { curriculumProgressApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  curriculumProgressApi: {
    getProgress: vi.fn(),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student' } }),
}));

describe('CurriculumProgress Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CurriculumProgressPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders curriculum progress page heading', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
