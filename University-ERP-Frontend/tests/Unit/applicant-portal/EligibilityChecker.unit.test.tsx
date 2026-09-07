import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EligibilityCheckerPage } from '../../../apps/applicant-portal/src/features/EligibilityChecker/EligibilityChecker.page';
import { admissionsApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    checkEligibility: vi.fn().mockResolvedValue({
      eligible: true,
      message: 'You meet all minimum entrance requirements.'
    }),
  },
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'applicant-123' },
    user: { id: 'applicant-123' }
  }),
}));

describe("EligibilityChecker - Unit Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EligibilityCheckerPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("renders eligibility checker page heading", async () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it("allows checking eligibility and displays result", async () => {
    const user = userEvent.setup();
    renderComponent();
    const btn = screen.getByRole('button', { name: /Check Eligibility/i });
    await user.click(btn);
    await waitFor(() => {
      expect(admissionsApi.checkEligibility).toHaveBeenCalled();
    });
  });
});
