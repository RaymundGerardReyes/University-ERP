import { useQuery, useMutation } from '@tanstack/react-query';
import { enrollmentPaymentApi } from './EnrollmentPayment.api';
import { InitiatePaymentRequest } from './EnrollmentPayment.types';

export const useAssessmentDetails = (assessmentId: string) => {
    return useQuery({
        queryKey: ['applicant', 'assessment', assessmentId],
        queryFn: () => enrollmentPaymentApi.getAssessmentDetails(assessmentId),
        enabled: !!assessmentId
    });
};

export const useInitiatePayment = () => {
    return useMutation({
        mutationFn: (request: InitiatePaymentRequest) => enrollmentPaymentApi.initiatePayment(request)
    });
};

export const usePaymentStatus = (paymentId: string) => {
    return useQuery({
        queryKey: ['applicant', 'payment', paymentId],
        queryFn: () => enrollmentPaymentApi.getPaymentStatus(paymentId),
        enabled: !!paymentId,
        refetchInterval: (query) => {
            const status = (query.state.data as any)?.status;
            return status === 'PROCESSING' || status === 'PAYMENT_PENDING' || status === 'PENDING' ? 3000 : false;
        }
    });
};
