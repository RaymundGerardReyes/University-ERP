import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AssessmentsPage } from '../../../apps/faculty-portal/src/features/Assessments/Assessments.page';
import { assessmentApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  assessmentApi: {
    getGradebook: vi.fn().mockResolvedValue([
      { studentId: 'STU-01', name: 'Alice Smith', prelim: 90, midterm: 88, final: 92 }
    ]),
    submitGrades: vi.fn().mockResolvedValue(true)
  }
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'FAC-01' }, user: { id: 'FAC-01' } })
}));

describe("Assessments - Unit Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/assessments/SEC-101']}>
          <Routes>
            <Route path="/assessments/:sectionId" element={<AssessmentsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("renders assessments and grading overview heading", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
