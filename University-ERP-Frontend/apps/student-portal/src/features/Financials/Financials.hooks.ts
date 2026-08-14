import { useMutation, useQuery } from '@tanstack/react-query';
import { financePaymentSessionApi, CreatePaymentSessionRequest } from '@university-erp/api-clients';
import { financialsApi } from './Financials.api';

export const useCurrentTermInvoice = (studentId: string, termId: string) => {
    return useQuery({
        queryKey: ['student', studentId, 'invoice', termId],
        queryFn: () => financialsApi.getCurrentTermInvoice(studentId, termId),
        enabled: !!studentId && !!termId
    });
};

export const useCreatePaymentSession = () => {
    return useMutation({
        mutationFn: (request: CreatePaymentSessionRequest) => 
             financePaymentSessionApi.createSession(request)
    });
};

export const usePaymentSessionStatus = (sessionId: string | null) => {
    return useQuery({
        queryKey: ['paymentSession', sessionId],
        queryFn: () => financePaymentSessionApi.validateSession(sessionId!),
        // Only run this query if we have a valid sessionId
        enabled: !!sessionId,
        // Poll every 3 seconds (3000ms)
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            // Stop polling if marked Paid or Expired
            if (status === 'Paid' || status === 'Expired') {
                return false; 
            }
            return 3000;
        }
    });
};
