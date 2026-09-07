import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AcademicConfigurationPage } from '../../../apps/admin-portal/src/features/AcademicConfiguration/AcademicConfiguration.page';

// 1. Mock Authentication
const mockUseAuth = vi.fn();
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => mockUseAuth()
}));

// 2. Mock API Client (To be implemented in your codebase)
const mockFetchConfig = vi.fn();
const mockUpdateConfig = vi.fn();
vi.mock('../../../apps/admin-portal/src/features/AcademicConfiguration/AcademicConfiguration.api', () => ({
    fetchAcademicConfig: () => mockFetchConfig(),
    updateAcademicConfig: (data: any) => mockUpdateConfig(data)
}));

const renderComponent = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <AcademicConfigurationPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('AcademicConfiguration - Unit Testing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({
            identity: { id: 'EMP-ADMIN-01', name: 'Admin', roles: ['AcademicAdmin'] },
            isAuthenticated: true
        });
    });

    // --- Rendering & States ---
    it('should render the AcademicConfiguration dashboard without crashing', () => {
        mockFetchConfig.mockResolvedValue({ activeTerm: 'First Semester 2026-2027' });
        renderComponent();
        expect(screen.getByText('Academic Configuration')).toBeDefined();
    });

    it('should display a loading skeleton while fetching initial configuration data', () => {
        // Delay promise resolution to simulate loading
        mockFetchConfig.mockImplementation(() => new Promise(() => {}));
        const { container } = renderComponent();
        expect(container.querySelector('.skeleton')).toBeDefined();
    });

    it.todo("should render error state component when fetching configuration data fails");
    it.todo("should properly handle unauthorized access and render a restricted access banner if the user lacks the AcademicAdmin role");

    // --- Data Parsing & Display ---
    it('should correctly parse and display the current active academic year and term', async () => {
        mockFetchConfig.mockResolvedValue({ activeTerm: 'First Semester 2026-2027', isLateEnrollmentAllowed: true });
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('First Semester 2026-2027')).toBeDefined();
            expect(screen.getByText('CURRENT TERM')).toBeDefined();
        });
    });

    it.todo("should accurately reflect the toggle state of 'Late Enrollment Allowed' based on fetched config");

    // --- Interactions & Prop-driven behavior ---
    it.todo("should disable the 'Create New Term' button if the current term is still open");
    it.todo("should trigger a refetch of configuration data when the 'Refresh' button is clicked");

    // --- Form Submissions & API Mocks ---
    it.todo("should call the API to create a new academic year when the form is submitted with valid data");
});
