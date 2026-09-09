import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { SchedulePage } from '../../../apps/student-portal/src/features/Schedule/Schedule.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student', name: 'John Doe' }, isAuthenticated: true })
}));

describe("Schedule - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders Schedule workspace heading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchedulePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Schedule Workspace")).toBeInTheDocument();
  });
});
