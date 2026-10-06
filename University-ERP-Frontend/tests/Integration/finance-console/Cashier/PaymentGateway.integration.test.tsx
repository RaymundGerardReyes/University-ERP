import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { PaymentGatewayPage } from '../../../../apps/finance-console/src/features/Cashier/PaymentGateway.page';
import { paymentGatewayApi } from '../../../../apps/finance-console/src/features/Cashier/Cashier.api';

vi.mock('../../../../apps/finance-console/src/features/Cashier/Cashier.api', () => ({
    paymentGatewayApi: {
        getQueue: vi.fn(),
        processPayment: vi.fn(),
    },
    cashierTerminalApi: {
        getQueue: vi.fn(),
        processPayment: vi.fn(),
    }
}));

describe('Finance Console - Cashier Payment Gateway Integration', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
        vi.clearAllMocks();
        window.alert = vi.fn();
    });

    it('IT-FIN-005 & IT-FIN-006: Should search token, display details, and settle transaction safely', async () => {
        const user = userEvent.setup();
        const mockTransaction = { 
            transactionToken: 'TXN-CSH-123', 
            referenceId: 'APP-101', 
            payerName: 'Alice Smith',
            amount: 50.00, 
            status: 'PENDING' as const,
            purpose: 'Tuition Fee'
        };
        
        vi.mocked(paymentGatewayApi.getQueue).mockResolvedValue([mockTransaction]);
        vi.mocked(paymentGatewayApi.processPayment).mockResolvedValue(undefined);

        render(<QueryClientProvider client={queryClient}><PaymentGatewayPage /></QueryClientProvider>);

        // 1. Verify queue loaded
        await waitFor(() => {
            expect(screen.getByText('TXN-CSH-123')).toBeInTheDocument();
            expect(screen.getByText('Alice Smith')).toBeInTheDocument();
            expect(screen.getByText('$50.00')).toBeInTheDocument();
        });

        // 2. Select transaction to inspect details
        const processButton = screen.getByRole('button', { name: /Process/i });
        await user.click(processButton);

        // 3. Verify details render in right panel
        await waitFor(() => {
            expect(screen.getAllByText('APP-101').length).toBeGreaterThan(0);
            expect(screen.getByText('TOTAL DUE')).toBeInTheDocument();
        });

        // 4. Confirm Cash Received
        const confirmButton = screen.getByRole('button', { name: /Confirm Cash Received/i });
        await user.click(confirmButton);

        // 5. Verify Mutation dispatch
        await waitFor(() => {
            expect(paymentGatewayApi.processPayment).toHaveBeenCalledWith({
                transactionToken: 'TXN-CSH-123',
                referenceId: 'APP-101',
                amount: 50.00
            });
        });
    });
});
