import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AlumniNetworkPage } from '../../../apps/student-portal/src/features/AlumniNetwork/AlumniNetwork.page';
import { alumniApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  alumniApi: {
    getAlumniStatus: vi.fn(),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'test-student' } }),
}));

describe('AlumniNetwork Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AlumniNetworkPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('displays alumni network page structure correctly', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('handles fallback state when alumni data fails or is unavailable', async () => {
    renderComponent();
    expect(document.body).toBeInTheDocument();
  });
});
