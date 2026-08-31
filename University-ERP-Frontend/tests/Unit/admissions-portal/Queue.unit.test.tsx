// Test Type: Unit Testing
//
// Portal: admissions-portal
// Feature: Queue
//
// Source References:
// University-ERP-Frontend/apps/admissions-portal/src/features/Queue/Queue.api.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/Queue/Queue.hooks.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/Queue/Queue.page.tsx
// University-ERP-Frontend/apps/admissions-portal/src/features/Queue/Queue.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthGuard } from '@university-erp/shell-kit';
import { AdmissionQueuePage } from '../../../../apps/faculty-portal/src/features/SecretaryWorkspace/AdmissionQueue.page';

const mockUseAuth = vi.fn();
vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => mockUseAuth(),
  AuthGuard: ({ allowedRoles, children }: any) => {
    const { identity } = mockUseAuth();
    if (!allowedRoles.some((role: string) => identity?.roles?.includes(role))) {
      return <div>403 Forbidden</div>;
    }
    return children;
  }
}));

const mockGetPendingApplications = vi.fn();
vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: { getPendingApplications: () => mockGetPendingApplications() }
}));

describe('Admissions Portal - Queue & Secretary Intake', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it('TC16: Should_Block_Access_If_User_Lacks_Admissions_Role', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, identity: { roles: ['Student'] } });
    
    render(
      <MemoryRouter initialEntries={['/admissions/queue']}>
        <Routes>
          <Route path="/admissions/queue" element={
            <AuthGuard allowedRoles={['Admissions_Secretary']}>
              <AdmissionQueuePage />
            </AuthGuard>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('403 Forbidden')).toBeDefined();
    expect(screen.queryByTestId('admission-queue-table')).toBeNull();
  });

  it('TC17: SecretaryIntake_Should_Render_Loading_State_While_Fetching_Applications', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, identity: { roles: ['Admissions_Secretary'] } });
    mockGetPendingApplications.mockImplementation(() => new Promise(() => {}));
    
    render(
      <QueryClientProvider client={queryClient}>
        <AdmissionQueuePage />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('loading-skeleton')).toBeDefined();
  });

  it('TC18: SecretaryIntake_Should_Fetch_And_Render_Pending_Applications_List', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, identity: { roles: ['Admissions_Secretary'] } });
    mockGetPendingApplications.mockResolvedValue([
      { id: 'APP-101', applicantName: 'Jane Doe', status: 'Submitted' }
    ]);
    
    render(
      <QueryClientProvider client={queryClient}>
        <AdmissionQueuePage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeDefined();
      expect(screen.getByText('Submitted')).toBeDefined();
    });
  });
});
