import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { CalendarPage } from '../../../apps/lms-web/src/features/Calendar/Calendar.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getCalendarEvents: vi.fn().mockResolvedValue([])
  }
}));

describe("Calendar - End-to-End Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("verifies LMS academic calendar timeline and assessment milestones", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CalendarPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("LMS Academic Calendar");
    await waitFor(() => {
      expect(screen.getByText(/Lab 1 Submission Deadline/i)).toBeInTheDocument();
    });
  });
});
