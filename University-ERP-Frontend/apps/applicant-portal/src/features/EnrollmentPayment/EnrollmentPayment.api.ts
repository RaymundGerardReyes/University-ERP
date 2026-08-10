import { apiClient } from '@university-erp/api-clients';
import { EnrollmentPaymentDto, InitiatePaymentRequest } from './EnrollmentPayment.types';

export const enrollmentPaymentApi = {
    getAssessmentDetails: async (assessmentId: string): Promise<any> => {
        const response = await apiClient.get(`/api/applicant/enrollment/assessments/${assessmentId}`);
        return response.data;
    },
    
    initiatePayment: async (request: InitiatePaymentRequest): Promise<EnrollmentPaymentDto> => {
        const response = await apiClient.post('/api/applicant/enrollment/payments', request);
        return response.data;
    },

    getPaymentStatus: async (paymentId: string): Promise<EnrollmentPaymentDto> => {
        const response = await apiClient.get(`/api/applicant/enrollment/payments/${paymentId}`);
        return response.data;
    }
};
