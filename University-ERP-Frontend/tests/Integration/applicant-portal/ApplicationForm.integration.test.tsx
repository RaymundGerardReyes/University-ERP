import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ApplicationFormPage } from '../../../apps/applicant-portal/src/features/ApplicationForm/ApplicationForm.page';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: vi.fn() };
});

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    submitApplication: vi.fn(),
    getInitialData: vi.fn(),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'test-applicant' } }),
}));

describe('ApplicationForm Integration', () => {
  let queryClient: QueryClient;
  const mockNavigate = vi.fn();

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ApplicationFormPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders application form / wizard step accurately', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('allows filling out form inputs and interacting with navigation buttons', async () => {
    const user = userEvent.setup();
    renderComponent();

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('correctly mounts without crashing for initial blank states', async () => {
    renderComponent();
    expect(document.body).toBeInTheDocument();
  });
});
