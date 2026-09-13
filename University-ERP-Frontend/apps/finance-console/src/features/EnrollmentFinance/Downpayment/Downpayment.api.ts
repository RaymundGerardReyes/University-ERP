import { apiClient } from '@university-erp/api-clients';
import { DownpaymentDto, VerifyDownpaymentRequest } from './Downpayment.types';
import { toSafeArray } from '../../../utils/arrayUtils';

export const downpaymentApi = {
    getPendingPayments: async (): Promise<DownpaymentDto[]> => {
        const response = await apiClient.get<DownpaymentDto[]>('/finance/enrollment/downpayments/pending');
        return toSafeArray<DownpaymentDto>(response.data);
    },
    
    verifyPayment: async (request: VerifyDownpaymentRequest): Promise<void> => {
        await apiClient.post(`/finance/enrollment/downpayments/${request.paymentId}/verify`, request);
    }
};
