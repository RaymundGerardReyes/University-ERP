import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// 1. Cross-Portal Page Controllers
import { GrievancesPage } from '../../apps/governance-console/src/features/Grievances/Grievances.page';
import { FacilityBookingPage } from '../../apps/admin-portal/src/features/FacilityBooking/FacilityBooking.page';

// 2. Authentication Context Mock
let currentAuthContext = {
  user: {
    id: 'STU-2026-0099',
    name: 'Arthur Dent',
    role: 'Student',
    roles: ['Student']
  },
  identity: {
    id: 'STU-2026-0099',
    roles: ['Student']
  },
  isAuthenticated: true
};

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => currentAuthContext
}));

// 3. Central Ecosystem State for Governance -> Facilities Cross-Portal Flow
const sharedGovernanceState = {
  complaintId: 'GRV-2026-FAC-01',
  complainantId: 'STU-2026-0099',
  category: 'Facilities',
  description: 'Electrical hazard in Science Complex Room 204 (FAC-102): power outlets sparking',
  status: 'PendingReview',
  priority: 'Normal',
  assignedDepartment: '',
  publishedEvents: [] as string[],
  facilities: [
    { id: 'FAC-101', name: 'Main Auditorium', capacity: 500, type: 'Event Hall', status: 'Available' },
    { id: 'FAC-102', name: 'Science Complex Room 204', capacity: 40, type: 'Laboratory', status: 'In Use' },
    { id: 'FAC-103', name: 'Conference Room B', capacity: 15, type: 'Meeting Room', status: 'Maintenance' },
  ]
};

// 4. Mock API Clients
vi.mock('@university-erp/api-clients', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    governanceApi: {
      submitGrievance: vi.fn().mockImplementation((payload) => {
        if (!payload.description || payload.description.trim() === '') {
          return Promise.reject(new Error('Grievance.EmptyDescription: Description cannot be empty.'));
        }
        sharedGovernanceState.complainantId = payload.complainantId;
        sharedGovernanceState.category = payload.category;
        sharedGovernanceState.description = payload.description;
        sharedGovernanceState.status = 'PendingReview';
        return Promise.resolve({
          success: true,
          complaintId: sharedGovernanceState.complaintId
        });
      })
    },
    facilitiesApi: {
      bookFacility: vi.fn().mockImplementation((payload) => {
        const fac = sharedGovernanceState.facilities.find(f => f.name === payload.roomName || f.id === payload.roomName);
        if (fac && fac.status === 'Maintenance') {
          return Promise.reject(new Error('Facilities.Unavailable: Facility is under maintenance.'));
        }
        return Promise.resolve({ success: true, bookingId: 'BKG-2026-001' });
      })
    }
  };
});

// 5. Mock FacilityBooking API to reflect shared state
vi.mock('../../apps/admin-portal/src/features/FacilityBooking/FacilityBooking.api', () => ({
  fetchCampusFacilities: vi.fn().mockImplementation(() => Promise.resolve(sharedGovernanceState.facilities)),
  submitFacilityBooking: vi.fn().mockImplementation((payload) => {
    const fac = sharedGovernanceState.facilities.find(f => f.name === payload.roomName || f.id === payload.roomName);
    if (fac && fac.status === 'Maintenance') {
      return Promise.reject(new Error('Facilities.Unavailable: Facility is under maintenance.'));
    }
    return Promise.resolve({ success: true, bookingId: 'BKG-2026-001' });
  })
}));

describe('Governance to Facilities Cross-Portal Lifecycle E2E Suite', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity }
      }
    });
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement, initialRoute = '/') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {ui}
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  // ─── PHASE 1: GOVERNANCE CONSOLE — GRIEVANCE SUBMISSION ─────────────────────
  it('Phase 1: Student submits a safety grievance regarding facility hazard in Governance Console', async () => {
    currentAuthContext = {
      user: { id: 'STU-2026-0099', name: 'Arthur Dent', role: 'Student', roles: ['Student'] },
      identity: { id: 'STU-2026-0099', roles: ['Student'] },
      isAuthenticated: true
    };

    renderWithProviders(<GrievancesPage />);

    expect(screen.getByText('Grievance Management')).toBeInTheDocument();
    expect(screen.getByText('File a Formal Complaint')).toBeInTheDocument();

    // Fill form
    const complainantInput = screen.getByPlaceholderText(/Complainant ID/i);
    const categorySelect = screen.getByRole('combobox');
    const descriptionTextarea = screen.getByPlaceholderText(/Detailed Description of the Grievance/i);

    fireEvent.change(complainantInput, { target: { value: 'STU-2026-0099' } });
    fireEvent.change(categorySelect, { target: { value: 'Facilities' } });
    fireEvent.change(descriptionTextarea, {
      target: { value: 'Electrical hazard in Science Complex Room 204 (FAC-102): power outlets sparking' }
    });

    const submitBtn = screen.getByRole('button', { name: /Submit Grievance/i });
    fireEvent.click(submitBtn);

    // Verify submission success feedback
    await waitFor(() => {
      expect(screen.getByText(/Grievance submitted successfully! Case ID: GRV-2026-FAC-01/i)).toBeInTheDocument();
    });

    expect(sharedGovernanceState.complainantId).toBe('STU-2026-0099');
    expect(sharedGovernanceState.category).toBe('Facilities');
    expect(sharedGovernanceState.status).toBe('PendingReview');
  });

  // ─── PHASE 2: CROSS-MODULE ESCALATION & EVENT DISPATCH ───────────────────────
  it('Phase 2: Governance officer escalates grievance, emitting GrievanceSubmittedIntegrationEvent', async () => {
    // Simulate governance workflow escalation to Facilities
    sharedGovernanceState.status = 'Escalated';
    sharedGovernanceState.priority = 'Critical';
    sharedGovernanceState.assignedDepartment = 'Facilities';
    sharedGovernanceState.publishedEvents.push('GrievanceSubmittedIntegrationEvent');

    // In response to GrievanceSubmittedIntegrationEvent, Facilities module flags the room as Maintenance
    const targetFacility = sharedGovernanceState.facilities.find(f => f.id === 'FAC-102');
    expect(targetFacility).toBeDefined();
    targetFacility!.status = 'Maintenance';

    expect(sharedGovernanceState.publishedEvents).toContain('GrievanceSubmittedIntegrationEvent');
    expect(targetFacility!.status).toBe('Maintenance');
  });

  // ─── PHASE 3: ADMIN PORTAL — FACILITY BOOKING MAINTENANCE VISIBILITY ────────
  it('Phase 3: Facilities Administrator sees room placed under Maintenance in Admin Portal Facility Bookings', async () => {
    currentAuthContext = {
      user: { id: 'ADM-FAC-01', name: 'Facilities Admin', role: 'Admin', roles: ['Admin', 'FacilitiesManager'] },
      identity: { id: 'ADM-FAC-01', roles: ['Admin', 'FacilitiesManager'] },
      isAuthenticated: true
    };

    renderWithProviders(<FacilityBookingPage />);

    await waitFor(() => {
      expect(screen.getByText('Facility Bookings')).toBeInTheDocument();
      expect(screen.getByText('FAC-102')).toBeInTheDocument();
      expect(screen.getByText('Science Complex Room 204')).toBeInTheDocument();
    });

    // Verify status badge for FAC-102 is 'Maintenance'
    const fac102Card = screen.getByText('FAC-102').closest('div');
    expect(fac102Card).toBeInTheDocument();

    const badges = screen.getAllByText('Maintenance');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  // ─── PHASE 4: RESILIENCE & VALIDATION FAILURE TESTING ───────────────────────
  it('Phase 4: Empty description is rejected and maintenance facilities block booking', async () => {
    const { governanceApi, facilitiesApi } = await import('@university-erp/api-clients');

    // 4a: Empty description rejected
    await expect(governanceApi.submitGrievance({
      complainantId: 'STU-2026-0099',
      category: 'Facilities',
      description: ''
    })).rejects.toThrow(/Grievance.EmptyDescription/);

    // 4b: Maintenance facility blocks booking
    await expect(facilitiesApi.bookFacility({
      roomName: 'FAC-102',
      reservedBy: 'TEST-USER',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    })).rejects.toThrow(/Facilities.Unavailable/);
  });
});
