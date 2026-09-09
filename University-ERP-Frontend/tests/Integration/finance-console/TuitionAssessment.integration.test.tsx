import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { TuitionAssessmentPage } from '../../../apps/finance-console/src/features/TuitionAssessment/TuitionAssessment.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'fin-assessor', roles: ['ROLE_FINANCE_ASSESSOR'] }, isAuthenticated: true })
}));

describe("TuitionAssessment - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders tuition assessment page heading and candidates table", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TuitionAssessmentPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Student ID")).toBeInTheDocument();
  });
});
