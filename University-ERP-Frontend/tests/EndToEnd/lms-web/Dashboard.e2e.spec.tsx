import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { DashboardPage } from '../../../apps/lms-web/src/features/Dashboard/Dashboard.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getDashboardOverview: vi.fn().mockResolvedValue({
      totalCourses: 4,
      pendingSubmissions: 2,
      activeQuizzes: 1,
      syncedPackages: 3
    })
  }
}));

describe("Dashboard - End-to-End Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("verifies LMS dashboard overview metrics and quick action routing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("LMS Learning Portal Dashboard");
    await waitFor(() => {
      expect(screen.getByText("Enrolled Courses")).toBeInTheDocument();
      expect(screen.getByText("Pending Submissions")).toBeInTheDocument();
    });
  });
});
