import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { SubmissionReviewPage } from '../../../apps/lms-web/src/features/OfflineSubmissionReview/SubmissionReview.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'instr-01', roles: ['ROLE_INSTRUCTOR'] }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getOfflineSubmissions: vi.fn().mockResolvedValue([
      {
        id: 'SUB-1',
        studentId: 'STU-2026-8812',
        assignmentTitle: 'CS101 - Lab 1: Binary Search',
        syncedAtUtc: '2026-08-06 08:30 AM',
        status: 'Pending Review',
        maxScore: 100
      }
    ]),
    gradeSubmission: vi.fn().mockResolvedValue({ id: 'SUB-1', status: 'Graded', score: 95 })
  }
}));

describe("OfflineSubmissionReview - End-to-End Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("exercises offline submission review and instructor grading workflow", async () => {
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
    });

    fireEvent.click(screen.getByRole('button', { name: /grade submission/i }));
    await waitFor(() => {
      expect(screen.getByText(/Grade Submission: STU-2026-8812/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /submit grade & notify student/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Grade Submission: STU-2026-8812/i)).not.toBeInTheDocument();
    });
  });
});
