import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AdvisingPage } from '../../../../apps/faculty-portal/src/features/Advising/Advising.page';
import { fetchFacultyAdvisees } from '../../../../apps/faculty-portal/src/features/Advising/Advising.api';
import { useAuth } from '@university-erp/auth-sdk';

vi.mock('./Advising.api', () => ({
    fetchFacultyAdvisees: vi.fn(),
}));

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: vi.fn(),
}));

describe('Faculty Portal - Advising Cohort Management Integration', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            identity: { id: 'FAC-01', name: 'Prof. Turing' },
            user: { id: 'FAC-01' },
            isAuthenticated: true,
        });
    });

    const renderComponent = () => render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <AdvisingPage />
            </MemoryRouter>
        </QueryClientProvider>
    );

    it('IT-FP-003: Should compute cohort metrics and filter students by academic risk', async () => {
        const user = userEvent.setup();
        const mockAdvisees = [
            { studentId: 'STU-01', name: 'Alice Walker', program: 'BSCS', degreeProgress: 85, gwa: '1.25', status: 'Good' },
            { studentId: 'STU-02', name: 'Bob Roberts', program: 'BSIT', degreeProgress: 40, gwa: '3.10', status: 'At Risk' },
            { studentId: 'STU-03', name: 'Charlie Kim', program: 'BSCS', degreeProgress: 60, gwa: '2.80', status: 'Warning' },
        ];

        (fetchFacultyAdvisees as any).mockResolvedValue(mockAdvisees);

        renderComponent();

        // 1. Check metric computation
        await waitFor(() => {
            expect(screen.getByText('3')).toBeDefined(); // Total Cohort
            expect(screen.getByText('2')).toBeDefined(); // Requires Attention (At Risk + Warning)
        });

        // 2. All 3 students rendered initially
        expect(screen.getByText('Alice Walker')).toBeDefined();
        expect(screen.getByText('Bob Roberts')).toBeDefined();
        expect(screen.getByText('Charlie Kim')).toBeDefined();

        // 3. Filter by At Risk
        const atRiskBtn = screen.getByRole('button', { name: /At Risk/i });
        await user.click(atRiskBtn);

        // 4. Good student should be filtered out
        expect(screen.queryByText('Alice Walker')).toBeNull();
        expect(screen.getByText('Bob Roberts')).toBeDefined();
        expect(screen.getByText('Charlie Kim')).toBeDefined();
    });
});
