import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EnrollmentPage } from '../../../apps/student-portal/src/features/Enrollment/Enrollment.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'STU-101', name: 'John Student' },
    user: { id: 'STU-101', name: 'John Student' },
    isAuthenticated: true,
  })
}));

describe("Enrollment - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders Enrollment page heading", async () => {
    render(<QueryClientProvider client={queryClient}><MemoryRouter><EnrollmentPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
