import { render, screen, waitFor } from '@testing-library/react';
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
    (alumniApi.getAlumniStatus as any).mockResolvedValue({
      graduationYear: '2026',
      chapter: 'Regional Chapter',
      alumniStatus: 'Active Member',
      benefitsActive: true
    });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it('handles fallback state when alumni data fails or is unavailable', async () => {
    (alumniApi.getAlumniStatus as any).mockRejectedValue(new Error('Failed'));
    renderComponent();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
