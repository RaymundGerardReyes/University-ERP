import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { GradesPage } from '../../../apps/lms-web/src/features/Grades/Grades.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getGrades: vi.fn().mockResolvedValue([])
  }
}));

describe("Grades - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders grades dashboard and assessment score table", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradesPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Student Grades & Academic Standing");

    await waitFor(() => {
      expect(screen.getByText(/Lab 1: Binary Search/i)).toBeInTheDocument();
      expect(screen.getByText("95 / 100")).toBeInTheDocument();
    });
  });
});
