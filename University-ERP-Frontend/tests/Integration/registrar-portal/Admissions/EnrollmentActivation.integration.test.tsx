import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EnrollmentActivationPage } from '../../../../apps/registrar-portal/src/features/Admissions/EnrollmentActivation.page';
import { fetchAdmissionsQueue } from '../../../../apps/registrar-portal/src/features/AdmissionsDivision/Admissions.api';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';

vi.mock('../AdmissionsDivision/Admissions.api', () => ({
    fetchAdmissionsQueue: vi.fn(),
}));

vi.mock('@university-erp/workflow-sdk', () => ({
    AdmissionWorkflow: {
        advance: vi.fn(),
    }
}));

describe('Registrar Portal - Enrollment Activation Integration', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        vi.clearAllMocks();
    });

    const renderComponent = () => render(
        <QueryClientProvider client={queryClient}>
            <EnrollmentActivationPage />
        </QueryClientProvider>
    );

    it('IT-REG-001: Should load queue, open confirmation modal, and dispatch RegistrarEnrollment command', async () => {
        const user = userEvent.setup();
        
        const mockQueue = [
            { id: 'ADM-2026-901', applicantName: 'James Wilson', program: 'BS Architecture', status: 'FINANCIAL_CLEARANCE' }
        ];

        (fetchAdmissionsQueue as any).mockResolvedValue(mockQueue);
        (AdmissionWorkflow.advance as any).mockResolvedValue({ success: true });

        renderComponent();

        // 1. Verify queue loaded
        await waitFor(() => {
            expect(screen.getByText('James Wilson')).toBeDefined();
            expect(screen.getByText('BS Architecture')).toBeDefined();
            expect(screen.getByText('FINANCIAL CLEARANCE')).toBeDefined();
        });

        // 2. Click "Activate Enrollment" to open modal
        const activateBtn = screen.getByRole('button', { name: /Activate Enrollment/i });
        await user.click(activateBtn);

        // 3. Modal should appear with verified clearance badge
        expect(screen.getByText('Confirm Official Enrollment')).toBeDefined();
        expect(screen.getByText('Financial Clearance Confirmed')).toBeDefined();

        // 4. Click the confirm button in the modal
        const modalConfirmBtn = screen.getAllByRole('button', { name: /Activate Enrollment/i })[1];
        await user.click(modalConfirmBtn);

        // 5. Verify Workflow SDK contract invocation
        await waitFor(() => {
            expect(AdmissionWorkflow.advance).toHaveBeenCalledWith('ADM-2026-901', 'RegistrarEnrollment');
        });

        // 6. Modal should close on success
        await waitFor(() => {
            expect(screen.queryByText('Confirm Official Enrollment')).toBeNull();
        });
    });
});
