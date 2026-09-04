import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EnrollmentPaymentPage } from '../../../../apps/applicant-portal/src/features/EnrollmentPayment/EnrollmentPayment.page';
import { admissionsApi, financeApi, financeBillingApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

vi.mock('@university-erp/api-clients', () => ({
    admissionsApi: {
        getApplicantJourney: vi.fn(),
        getApplicationStatus: vi.fn(),
    },
    financeApi: {
        getInvoices: vi.fn(),
        createPaymentSession: vi.fn(),
    },
    financeBillingApi: {
        generateCashToken: vi.fn(),
    }
}));

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: vi.fn(),
}));

describe('Applicant Portal - Enrollment Payment Cross-State Integration', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            identity: { id: 'APP-101', name: 'Jane Doe' },
            isAuthenticated: true,
        });
    });

    const renderComponent = () => render(
        <QueryClientProvider client={queryClient}>
            <EnrollmentPaymentPage />
        </QueryClientProvider>
    );

    it('IT-APP-007: Should show Awaiting Finance Assessment state when no downpayment invoice exists', async () => {
        (admissionsApi.getApplicantJourney as any).mockResolvedValue({ applicantId: 'APP-101' });
        (admissionsApi.getApplicationStatus as any).mockResolvedValue([{ id: 'APP-101', status: 'Accepted' }]);
        (financeApi.getInvoices as any).mockResolvedValue([]);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Awaiting Finance Assessment')).toBeDefined();
            expect(screen.getByText('Processing Upstream')).toBeDefined();
        });
    });

    it('IT-APP-008: Should render unpaid invoice and generate cash token on demand', async () => {
        const user = userEvent.setup();
        (admissionsApi.getApplicantJourney as any).mockResolvedValue({ applicantId: 'APP-101' });
        (admissionsApi.getApplicationStatus as any).mockResolvedValue([{ id: 'APP-101', status: 'Accepted' }]);
        (financeApi.getInvoices as any).mockResolvedValue([
            { invoiceId: 'INV-2026-001', studentId: 'APP-101', amountDue: 500, description: 'Enrollment Downpayment', dueDate: '2026-09-30', status: 'UNPAID' }
        ]);
        (financeBillingApi.generateCashToken as any).mockResolvedValue('TXN-CSH-999');

        renderComponent();

        // 1. Verify invoice details
        await waitFor(() => {
            expect(screen.getByText('INV-2026-001')).toBeDefined();
            expect(screen.getByText('$500.00')).toBeDefined();
        });

        // 2. Switch to Pay at Cashier tab
        const cashierTabBtn = screen.getByRole('button', { name: /Pay at Cashier/i });
        await user.click(cashierTabBtn);

        // 3. Generate token
        const genTokenBtn = screen.getByRole('button', { name: /Generate Official Cash Token/i });
        await user.click(genTokenBtn);

        // 4. Verify token creation
        await waitFor(() => {
            expect(financeBillingApi.generateCashToken).toHaveBeenCalledWith('INV-2026-001', 500);
            expect(screen.getByText('TXN-CSH-999')).toBeDefined();
        });
    });
});
