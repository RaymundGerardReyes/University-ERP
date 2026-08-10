import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { downpaymentApi } from './Downpayment.api';
import { VerifyDownpaymentRequest } from './Downpayment.types';

export const usePendingDownpayments = () => {
    return useQuery({
        queryKey: ['finance', 'downpayments', 'pending'],
        queryFn: downpaymentApi.getPendingPayments
    });
};

export const useVerifyDownpayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: VerifyDownpaymentRequest) => downpaymentApi.verifyPayment(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'downpayments', 'pending'] });
        }
    });
};
