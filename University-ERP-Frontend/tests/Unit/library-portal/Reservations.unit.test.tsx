import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ReservationsPage } from '../../../apps/library-portal/src/features/Reservations/Reservations.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    user: { id: 'test-user-1', roles: ['Admin', 'Faculty', 'Student', 'ROLE_FACULTY_ADMIN', 'ROLE_REGISTRAR'] },
    identity: { id: 'test-user-1', roles: ['Admin'] },
    isAuthenticated: true
  })
}));

vi.mock('@university-erp/api-clients', () => ({
  apiClient: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: { success: true, id: '1' } }),
    put: vi.fn().mockResolvedValue({ data: { success: true } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true } })
  },
  governanceApi: {
    createEvent: vi.fn().mockResolvedValue({ eventId: 'EVT-101' }),
    submitGrievance: vi.fn().mockResolvedValue({ grievanceId: 'GRV-101' }),
    createTicket: vi.fn().mockResolvedValue({ ticketId: 'TCK-101' }),
    submitEvidence: vi.fn().mockResolvedValue({ evidenceId: 'EVD-101' }),
    logVisitor: vi.fn().mockResolvedValue({ visitorId: 'VIS-101' }),
    getEvents: vi.fn().mockResolvedValue([]),
    getGrievances: vi.fn().mockResolvedValue([]),
    getTickets: vi.fn().mockResolvedValue([]),
    getAccreditationStandards: vi.fn().mockResolvedValue([])
  },
  identityApi: {
    login: vi.fn().mockResolvedValue({ token: 'mock-token' }),
    register: vi.fn().mockResolvedValue({ userId: 'USR-101' }),
    resetPassword: vi.fn().mockResolvedValue({ success: true }),
    recoverPassword: vi.fn().mockResolvedValue({ success: true }),
    verifyMfa: vi.fn().mockResolvedValue({ success: true })
  },
  libraryCatalogApi: {
    checkoutItem: vi.fn().mockResolvedValue({ success: true }),
    getCatalogItems: vi.fn().mockResolvedValue([]),
    getDigitalResources: vi.fn().mockResolvedValue([]),
    getMyLoans: vi.fn().mockResolvedValue([]),
    getFines: vi.fn().mockResolvedValue([]),
    getReservations: vi.fn().mockResolvedValue([])
  },
  lmsApi: {
    getAssignments: vi.fn().mockResolvedValue([]),
    getCalendarEvents: vi.fn().mockResolvedValue([]),
    getCourseContent: vi.fn().mockResolvedValue({ title: 'Sample Course', description: 'Sample Description', modules: [] }),
    getDiscussions: vi.fn().mockResolvedValue([]),
    getGrades: vi.fn().mockResolvedValue([]),
    getQuizzes: vi.fn().mockResolvedValue([]),
    getTimeline: vi.fn().mockResolvedValue([])
  },
  analyticsApi: {
    getDashboardMetrics: vi.fn().mockResolvedValue({})
  },
  communicationApi: {
    getAnnouncements: vi.fn().mockResolvedValue([])
  }
}));

describe("Reservations - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders Reservations page heading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReservationsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 }) || screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
  });
});
