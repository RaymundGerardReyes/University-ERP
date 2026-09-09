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
      { id: 'ASN-1', title: 'Lab 1: Binary Search Implementation', courseId: 'CS-101', dueDate: '2026-08-15T00:00:00.000Z', status: 'Published' }
    ]),
    createAssignment: vi.fn().mockResolvedValue({ id: 'ASN-2', status: 'Published' })
  }
}));

describe("Assignments - End-to-End Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("exercises assignment authoring flow and verifies delta sync publication", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AssignmentsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Faculty Course Administration");

    const titleInput = screen.getByPlaceholderText(/e.g., Module 5/i);
    fireEvent.change(titleInput, { target: { value: 'Homework 3: Graph BFS' } });

    fireEvent.click(screen.getByRole('button', { name: /publish task for offline sync/i }));

    await waitFor(() => {
      expect(screen.getByText(/Task published successfully/i)).toBeInTheDocument();
    });
  });
});
