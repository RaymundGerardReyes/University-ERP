import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { StudentProfilePage } from '../../../apps/student-portal/src/features/StudentProfile/StudentProfile.page';
import { studentInformationApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
  studentInformationApi: {
    getProfile: vi.fn().mockResolvedValue({
      studentId: 'STU-101', fullName: 'John Student', program: 'BS Computer Science', yearLevel: '3rd Year', email: 'john@student.edu', gpa: '3.85'
    })
  }
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, identity: { id: 'STU-101' }, isAuthenticated: true })
}));

describe("StudentProfile - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders student profile page heading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StudentProfilePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
