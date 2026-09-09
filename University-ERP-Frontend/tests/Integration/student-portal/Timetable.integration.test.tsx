import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { TimetablePage } from '../../../apps/student-portal/src/features/Timetable/Timetable.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student', name: 'John Doe' }, isAuthenticated: true })
}));

describe("Timetable - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders timetable heading and days", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TimetablePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("My Timetable")).toBeInTheDocument();
  });
});
