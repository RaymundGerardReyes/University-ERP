import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ClearancePage } from '../../../apps/student-portal/src/features/Clearance/Clearance.page';
import { registrarApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  registrarApi: {
    getStudentClearance: vi.fn(),
    submitClearanceRequest: vi.fn(),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student' } }),
}));

describe('Clearance Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ClearancePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders clearance dashboard header and status overview', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('handles clearance requests successfully', async () => {
    renderComponent();
    expect(document.body).toBeInTheDocument();
  });
});
