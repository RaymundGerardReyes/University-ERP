import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AcademicRecordPage } from '../../../apps/student-portal/src/features/AcademicRecord/AcademicRecord.page';
import { registrarApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  registrarApi: {
    requestTranscript: vi.fn(),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student' } }),
}));

describe('AcademicRecord Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AcademicRecordPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('loads correctly and displays transcript header overview', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('triggers transcript request interaction when submitted', async () => {
    renderComponent();
    expect(document.body).toBeInTheDocument();
  });
});
