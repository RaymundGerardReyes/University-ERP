import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LearningManagementPage } from '../../../apps/student-portal/src/features/LearningManagement/LearningManagement.page';

vi.mock('../../../apps/student-portal/src/features/LearningManagement/LearningManagement.hooks', () => ({
  useCourseContent: () => ({
    data: {
      title: 'Intro to Computer Science',
      description: 'Foundational CS Concepts',
      modules: []
    },
    isLoading: false,
    isError: false
  })
}));

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, identity: { id: 'STU-101' } })
}));

describe("LearningManagement - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders LearningManagement page heading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LearningManagementPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
