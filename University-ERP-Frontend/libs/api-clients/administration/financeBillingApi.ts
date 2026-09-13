import { apiClient } from '../apiClient';

export interface CashTransactionDto {
    transactionToken: string;
    referenceId: string;
    amount: number;
    status: string;
}

export const financeBillingApi = {
    // Legacy / Direct: Used for Credit Card / Online Transfers directly
    payApplicationFee: async (applicationId: string, paymentDetails: { cardNumber?: string, amount: number, transactionId?: string }): Promise<boolean> => {
        const finalTransactionId = paymentDetails.transactionId || `TXN-ONL-${Math.floor(Math.random() * 1000000)}`;
        const response = await apiClient.post(`/admissions/applications/${applicationId}/pay-fee`, {
            transactionId: finalTransactionId
        });
        return response.status === 200;
    },

    // NEW: Generate a token for Over-The-Counter Cash Payments
    generateCashToken: async (referenceId: string, amount: number): Promise<string> => {
        const response = await apiClient.post<{ token: string }>('/finance/cash-transactions', {
            referenceId,
            amount
        });
        return response.data.token;
    },

    // NEW: Finance Cashier fetching the pending token details
    getPendingCashToken: async (token: string): Promise<CashTransactionDto> => {
        const response = await apiClient.get<CashTransactionDto>(`/finance/cash-transactions/${token}`);
        return response.data;
    },

    // NEW: Finance Cashier marking the cash received
    completeCashTransaction: async (token: string): Promise<boolean> => {
        const response = await apiClient.post(`/finance/cash-transactions/${token}/complete`);
        return response.status === 200;
    }
};