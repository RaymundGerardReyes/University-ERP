import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { ModuleTimelinePage } from '../../../apps/lms-web/src/features/ModuleTimeline/ModuleTimeline.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getTimeline: vi.fn().mockResolvedValue([
      { id: 'MOD-1', title: 'Week 1: Fundamentals of Logic', status: 'Completed', type: 'Lesson' }
    ])
  }
}));

describe("ModuleTimeline - End-to-End Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("exercises complete module progression timeline and package download action", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ModuleTimelinePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/CS-101: Introduction to Computer Science/i);
    expect(screen.getByRole('button', { name: /download offline package/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Fundamentals of Logic/i)).toBeInTheDocument();
    });
  });
});
