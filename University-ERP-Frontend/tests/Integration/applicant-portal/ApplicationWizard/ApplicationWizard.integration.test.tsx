import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ApplicationWizardPage } from '../../../../apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.page';
import { fetchProgramCatalog, submitNewApplication } from '../../../../apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.api';
import { useAuth } from '@university-erp/auth-sdk';

vi.mock('./ApplicationWizard.api', () => ({
    fetchProgramCatalog: vi.fn(),
    submitNewApplication: vi.fn(),
}));

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: vi.fn(),
}));

describe('Applicant Portal - Application Wizard Multi-Step Integration', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            identity: { id: 'USER-100', name: 'Jane Doe' },
            isAuthenticated: true,
        });
    });

    const renderComponent = () => render(
        <QueryClientProvider client={queryClient}>
            <ApplicationWizardPage />
        </QueryClientProvider>
    );

    it('IT-APP-001: Should select program, advance step, enter academic credentials, and submit application', async () => {
        const user = userEvent.setup();
        const mockPrograms = [
            { id: 'BSCS', degree: 'B.S.', major: 'Computer Science' }
        ];

        (fetchProgramCatalog as any).mockResolvedValue(mockPrograms);
        (submitNewApplication as any).mockResolvedValue('APP-2026-0001');

        renderComponent();

        // 1. Verify Step 1 mounts
        await waitFor(() => {
            expect(screen.getByText('Step 1: Program Selection')).toBeDefined();
        });

        const nextBtn = screen.getByRole('button', { name: /Next Step/i }) as HTMLButtonElement;
        expect(nextBtn.disabled).toBe(true);

        // Select program
        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'BSCS');
        expect(nextBtn.disabled).toBe(false);

        await user.click(nextBtn);

        // 2. Verify Step 2 mounts
        await waitFor(() => {
            expect(screen.getByText('Step 2: Academic History')).toBeDefined();
        });

        const submitBtn = screen.getByRole('button', { name: /Submit Application/i }) as HTMLButtonElement;
        expect(submitBtn.disabled).toBe(true);

        // Fill academic history
        const schoolInput = screen.getByPlaceholderText(/High School or College Name/i);
        const gpaInput = screen.getByPlaceholderText(/e\.g\. 3\.8/i);
        await user.type(schoolInput, 'Lincoln High School');
        await user.type(gpaInput, '3.85');

        expect(submitBtn.disabled).toBe(false);
        await user.click(submitBtn);

        // 3. Verify Step 3 (Success confirmation)
        await waitFor(() => {
            expect(submitNewApplication).toHaveBeenCalledWith({
                applicantId: 'USER-100',
                programId: 'BSCS',
                firstName: 'Jane',
                lastName: 'Doe',
                dateOfBirth: '2000-01-01',
                nationality: 'Domestic'
            });
            expect(screen.getByText('Application Submitted!')).toBeDefined();
        });
    });
});
