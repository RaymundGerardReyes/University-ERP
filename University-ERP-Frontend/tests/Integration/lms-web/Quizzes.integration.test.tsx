import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { QuizzesPage } from '../../../apps/lms-web/src/features/Quizzes/Quizzes.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getQuizzes: vi.fn().mockResolvedValue([
      { id: 'QZ-01', title: 'Quiz 1: Logic Gates & Truth Tables', timeLimitMinutes: 30, totalQuestions: 15, status: 'Available' }
    ])
  }
}));

describe("Quizzes - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders quiz catalog and assessment options", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <QuizzesPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Course Quizzes & Assessments");

    await waitFor(() => {
      expect(screen.getByText(/Logic Gates & Truth Tables/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument();
    });
  });
});
