import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { PaymentGatewayPage } from '../../../../apps/finance-console/src/features/Cashier/PaymentGateway.page';
import { financeBillingApi } from '@university-erp/api-clients';

vi.mock('@university-erp/api-clients', () => ({
    financeBillingApi: {
        getPendingCashToken: vi.fn(),
        completeCashTransaction: vi.fn(),
    }
}));

describe('Finance Console - Cashier Payment Gateway Integration', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        vi.clearAllMocks();
    });

    it('IT-FIN-005 & IT-FIN-006: Should search token, display details, and settle transaction safely', async () => {
        const user = userEvent.setup();
        const mockTransaction = { transactionToken: 'TXN-CSH-123', referenceId: 'APP-101', amount: 50.00, status: 'Pending' };
        
        (financeBillingApi.getPendingCashToken as any).mockResolvedValue(mockTransaction);
        (financeBillingApi.completeCashTransaction as any).mockResolvedValue(true);

        render(<QueryClientProvider client={queryClient}><PaymentGatewayPage /></QueryClientProvider>);

        // 1. Search for token
        await user.type(screen.getByPlaceholderText(/Enter Transaction Token/i), 'TXN-CSH-123');
        await user.click(screen.getByRole('button', { name: /Lookup Token/i }));

        // 2. Verify details render
        await waitFor(() => {
            expect(financeBillingApi.getPendingCashToken).toHaveBeenCalledWith('TXN-CSH-123');
            expect(screen.getByText('APP-101')).toBeDefined();
            expect(screen.getByText('$50.00')).toBeDefined();
        });

        // 3. Confirm Cash Received
        await user.click(screen.getByRole('button', { name: /Confirm Cash Received/i }));

        // 4. Verify Settlement and UI Reset
        await waitFor(() => {
            expect(financeBillingApi.completeCashTransaction).toHaveBeenCalledWith('TXN-CSH-123');
            expect(screen.queryByText('APP-101')).toBeNull(); // Token cleared on success
        });
    });
});
