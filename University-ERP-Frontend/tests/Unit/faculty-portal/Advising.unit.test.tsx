import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AdvisingPage } from '../../../apps/faculty-portal/src/features/Advising/Advising.page';

vi.mock('../../../apps/faculty-portal/src/features/Advising/Advising.api', () => ({
  fetchFacultyAdvisees: vi.fn().mockResolvedValue([
    { studentId: 'STU-01', name: 'Alice Walker', program: 'BSCS', degreeProgress: 85, gwa: '1.25', status: 'Good' }
  ]),
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'FAC-01', name: 'Prof. Turing' },
    user: { id: 'FAC-01' },
    isAuthenticated: true,
  }),
}));

describe("Advising - Unit Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdvisingPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("renders advising cohort page header", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it("renders advisee roster items correctly", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Alice Walker')).toBeInTheDocument();
    });
  });
});
