import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { DiscussionsPage } from '../../../apps/lms-web/src/features/Discussions/Discussions.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getDiscussions: vi.fn().mockResolvedValue([])
  }
}));

describe("Discussions - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders course discussion forum and thread creation trigger", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DiscussionsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Course Discussion Forum");
    expect(screen.getByRole('button', { name: '+ Start New Thread' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Recursion vs Iteration in Graph Traversal/i)).toBeInTheDocument();
    });
  });
});
