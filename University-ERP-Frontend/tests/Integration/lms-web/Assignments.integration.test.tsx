import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { AssignmentsPage } from '../../../apps/lms-web/src/features/Assignments/Assignments.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'FAC-101' }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getAssignments: vi.fn().mockResolvedValue([
      {
        id: 'ASN-01',
        title: 'Lab 1: Binary Search Implementation',
        courseId: 'CS-101',
        dueDate: '2026-08-15T00:00:00.000Z',
        points: 100,
        status: 'Published'
      }
    ]),
    createAssignment: vi.fn().mockResolvedValue({
      id: 'ASN-02',
      title: 'Module 5: Boolean Logic & Evaluation',
      courseId: 'CS-101',
      dueDate: '2026-08-25T00:00:00.000Z',
      status: 'Published'
    })
  }
}));

describe("Assignments - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders faculty assignment publisher and creates task for delta sync", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AssignmentsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Faculty Course Administration");

    await waitFor(() => {
      expect(screen.getByText(/Lab 1: Binary Search Implementation/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText(/e.g., Module 5/i);
    const textarea = screen.getByPlaceholderText(/Provide evaluation criteria/i);

    fireEvent.change(titleInput, { target: { value: 'Homework 2: Trees' } });
    fireEvent.change(textarea, { target: { value: 'Implement AVL tree rotations.' } });

    const publishBtn = screen.getByRole('button', { name: /publish task for offline sync/i });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(screen.getByText(/Task published successfully/i)).toBeInTheDocument();
    });
  });
});
