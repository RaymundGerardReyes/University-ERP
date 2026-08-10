import { apiClient } from '@university-erp/api-clients';
import { DownpaymentDto, VerifyDownpaymentRequest } from './Downpayment.types';

export const downpaymentApi = {
    getPendingPayments: async (): Promise<DownpaymentDto[]> => {
        const response = await apiClient.get('/api/finance/enrollment/downpayments/pending');
        return response.data;
    },
    
    verifyPayment: async (request: VerifyDownpaymentRequest): Promise<void> => {
        await apiClient.post(`/api/finance/enrollment/downpayments/${request.paymentId}/verify`, request);
    }
};
