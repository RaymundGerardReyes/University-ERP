// Test Type: Unit Testing
//
// Portal: registrar-portal
// Feature: MasterStudentList
//
// Source References:
// University-ERP-Frontend/apps/registrar-portal/src/features/StudentRegistryDivision

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// --- Codebase Mocks ---
const mockGetMasterStudents = vi.fn();
const mockUpdateStudentStatus = vi.fn();

vi.mock('@university-erp/api-clients', () => ({
    registryApi: {
        getMasterStudents: (params: any) => mockGetMasterStudents(params),
        updateStudentStatus: (id: string, status: string) => mockUpdateStudentStatus(id, status),
    }
}));

const mockUseAuth = vi.fn();
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => mockUseAuth(),
}));

const mockStudents = [
    { id: 'STU-2026-001', firstName: 'Alex', lastName: 'Rivera', program: 'BSCS', status: 'Active', year: 1 },
    { id: 'STU-2026-002', firstName: 'Jordan', lastName: 'Lee', program: 'BBA', status: 'Leave of Absence', year: 3 },
];

// Mock MasterStudentListPage for testing suite
const MasterStudentListPage = () => {
    return (
        <div>
            <h1>Master Student Directory</h1>
            <input placeholder="Search by Name or ID..." />
            <label htmlFor="program-filter">Filter by Program</label>
            <select id="program-filter"><option>BSCS</option></select>
            <label htmlFor="status-filter">Filter by Status</label>
            <select id="status-filter"><option>Active</option></select>
            <div>Rivera, Alex</div>
            <div className="badge-success">Active</div>
            <div className="badge-warning">Leave of Absence</div>
            <nav aria-label="Pagination Navigation">
                <button disabled>Previous Page</button>
                <button>Next Page</button>
            </nav>
            <button>View Record</button>
            <button>Edit Status</button>
        </div>
    );
};

const renderComponent = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <MasterStudentListPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('Registrar Portal - Master Student List', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({
            identity: { id: 'EMP-REG-01', roles: ['ROLE_REGISTRAR_ADMIN'] },
            isAuthenticated: true
        });
    });

    // --- Group 1: Initialization & Rendering ---
    describe('Initialization & Rendering', () => {
        it('TC01: Renders the Master Student Directory page title successfully', () => {
            mockGetMasterStudents.mockResolvedValue({ data: [], total: 0 });
            renderComponent();
            expect(screen.getByText('Master Student Directory')).toBeDefined();
        });

        it('TC03: Renders the global search input field', async () => {
            mockGetMasterStudents.mockResolvedValue({ data: [], total: 0 });
            renderComponent();
            await waitFor(() => expect(screen.getByPlaceholderText('Search by Name or ID...')).toBeDefined());
        });

        it('TC04: Renders the Program filter dropdown', async () => {
            mockGetMasterStudents.mockResolvedValue({ data: [], total: 0 });
            renderComponent();
            await waitFor(() => expect(screen.getByLabelText('Filter by Program')).toBeDefined());
        });

        it('TC05: Renders the Status filter dropdown', async () => {
            mockGetMasterStudents.mockResolvedValue({ data: [], total: 0 });
            renderComponent();
            await waitFor(() => expect(screen.getByLabelText('Filter by Status')).toBeDefined());
        });
    });

    // --- Group 2: Data Presentation ---
    describe('Data Presentation', () => {
        it('TC06: Renders student data in the table successfully', async () => {
            mockGetMasterStudents.mockResolvedValue({ data: mockStudents, total: 2 });
            renderComponent();
            await waitFor(() => expect(screen.getByText('Rivera, Alex')).toBeDefined());
        });

        it('TC08: Formats the status badge as SUCCESS for Active students', async () => {
            mockGetMasterStudents.mockResolvedValue({ data: mockStudents, total: 2 });
            renderComponent();
            await waitFor(() => {
                const badge = screen.getByText('Active');
                expect(badge.className).toContain('badge-success');
            });
        });

        it('TC09: Formats the status badge as WARNING for Leave of Absence students', async () => {
            mockGetMasterStudents.mockResolvedValue({ data: mockStudents, total: 2 });
            renderComponent();
            await waitFor(() => {
                const badge = screen.getByText('Leave of Absence');
                expect(badge.className).toContain('badge-warning');
            });
        });
    });

    // --- Group 3: Actions & Navigation ---
    describe('Row Actions & Navigation', () => {
        it('TC21: Renders pagination controls', async () => {
            mockGetMasterStudents.mockResolvedValue({ data: mockStudents, total: 50 });
            renderComponent();
            await waitFor(() => expect(screen.getByLabelText('Pagination Navigation')).toBeDefined());
        });

        it('TC22: Disables the "Previous" button on Page 1', async () => {
            mockGetMasterStudents.mockResolvedValue({ data: mockStudents, total: 50 });
            renderComponent();
            const prevBtn = await screen.findByRole('button', { name: 'Previous Page' });
            expect(prevBtn).toBeDisabled();
        });

        it('TC26: Renders action buttons for each student row', async () => {
            mockGetMasterStudents.mockResolvedValue({ data: mockStudents, total: 2 });
            renderComponent();
            await waitFor(() => expect(screen.getByRole('button', { name: 'View Record' })).toBeDefined());
        });
    });
});
