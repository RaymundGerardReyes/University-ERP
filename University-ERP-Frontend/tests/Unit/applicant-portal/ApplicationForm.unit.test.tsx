import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ApplicationFormPage } from '../../../apps/applicant-portal/src/features/ApplicationForm/ApplicationForm.page';

vi.mock('../../../apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.api', () => ({
  fetchProgramCatalog: vi.fn().mockResolvedValue([
    { id: 'BSCS', degree: 'B.S.', major: 'Computer Science' }
  ]),
  submitNewApplication: vi.fn(),
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'test-applicant', name: 'Jane Doe' },
    user: { id: 'test-applicant', name: 'Jane Doe' },
    isAuthenticated: true,
  }),
}));

describe("ApplicationForm - Unit Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
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

  it("renders the multi-step application form wizard without crashing", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it("renders step 1 program selection initially", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Step 1: Program Selection/i)).toBeInTheDocument();
    });
  });
});
