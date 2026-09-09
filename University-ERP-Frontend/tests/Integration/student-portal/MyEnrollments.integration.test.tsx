import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MyEnrollmentsPage } from '../../../apps/student-portal/src/features/MyEnrollments/MyEnrollments.page';

vi.mock('../../../apps/student-portal/src/features/MyEnrollments/MyEnrollments.hooks', () => ({
  useMyEnrollments: () => ({
    data: {
      programName: 'Computer Science',
      curriculumVersion: '2026-v1',
      academicYears: []
    },
    isLoading: false,
    isError: false
  })
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, identity: { id: 'STU-101' }, isAuthenticated: true })
}));

describe("MyEnrollments - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders my enrollments page heading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MyEnrollmentsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
