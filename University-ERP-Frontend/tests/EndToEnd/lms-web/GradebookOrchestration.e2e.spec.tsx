import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { GradebookSyncPage } from '../../../apps/lms-web/src/features/GradebookOrchestration/GradebookSync.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'instr-01', roles: ['ROLE_INSTRUCTOR'] }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getGradebookRecords: vi.fn().mockResolvedValue([
      { id: 'GB-1', studentId: 'STU-2026-8812', courseCode: 'CS101', finalScore: 91, letterGrade: 'A- (91%)', registrarStatus: 'Not Synced' }
    ]),
    syncGradesToRegistrar: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe("GradebookOrchestration - End-to-End Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("finalizes course grades and executes official Registrar database sync", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradebookSyncPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Gradebook Orchestration");
    await waitFor(() => {
      expect(screen.getByText("STU-2026-8812")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /sync to registrar/i }));
    await waitFor(() => {
      expect(screen.getByText(/Official grades synced to Registrar/i)).toBeInTheDocument();
    });
  });
});
