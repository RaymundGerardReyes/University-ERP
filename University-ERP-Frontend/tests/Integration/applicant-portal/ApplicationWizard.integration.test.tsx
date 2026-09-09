import { render, screen } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ApplicationWizardPage } from '../../../apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.page';

vi.mock('../../../apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.api', () => ({
  fetchProgramCatalog: vi.fn().mockResolvedValue([
    { id: 'BSCS', degree: 'B.S.', major: 'Computer Science' }
  ]),
  submitNewApplication: vi.fn(),
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'applicant-123' } }),
  useAuth: () => ({
    identity: { id: 'applicant-123', name: 'Jane Doe' },
    user: { id: 'applicant-123', name: 'Jane Doe' }
  }),
}));

describe('ApplicationWizard Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ApplicationWizardPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders application wizard steps correctly', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
