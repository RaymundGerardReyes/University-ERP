import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { SubmissionReviewPage } from '../../../apps/lms-web/src/features/OfflineSubmissionReview/SubmissionReview.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    user: { id: 'usr-instr-01', roles: ['ROLE_INSTRUCTOR', 'Faculty'] },
    isAuthenticated: true
  })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getOfflineSubmissions: vi.fn().mockResolvedValue([
      {
        id: 'SUB-2026-001',
        studentId: 'STU-2026-8812',
        studentName: 'Alice Chen',
        courseCode: 'CS101',
        assignmentTitle: 'CS101 - Lab 1: Binary Search',
        syncedAtUtc: '2026-08-06 08:30 AM',
        status: 'Pending Review',
        maxScore: 100
      }
    ]),
    gradeSubmission: vi.fn().mockResolvedValue({
      id: 'SUB-2026-001',
      status: 'Graded',
      score: 95
    })
  },
  apiClient: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: { success: true } })
  }
}));

describe("OfflineSubmissionReview - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders submission review page and executes grading workflow for synced submissions", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SubmissionReviewPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Offline Submission Review");

    await waitFor(() => {
      expect(screen.getByText("STU-2026-8812")).toBeInTheDocument();
      expect(screen.getByText(/Lab 1: Binary Search/i)).toBeInTheDocument();
    });

    const gradeBtn = screen.getByRole('button', { name: /grade submission/i });
    fireEvent.click(gradeBtn);

    await waitFor(() => {
      expect(screen.getByText(/Grade Submission: STU-2026-8812/i)).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: /submit grade & notify student/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Grade Submission: STU-2026-8812/i)).not.toBeInTheDocument();
    });
  });
});
