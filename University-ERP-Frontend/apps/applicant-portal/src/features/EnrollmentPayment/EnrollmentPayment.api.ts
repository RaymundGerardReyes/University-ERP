import { apiClient } from '@university-erp/api-clients';
import { EnrollmentPaymentDto, InitiatePaymentRequest } from './EnrollmentPayment.types';

export const enrollmentPaymentApi = {
    getAssessmentDetails: async (assessmentId: string): Promise<any> => {
        try {
            const response = await apiClient.get('/finance/enrollment/assessments/pending');
            const records = response.data ?? [];
            return records.find((r: any) => r.AssessmentId === assessmentId || r.assessmentId === assessmentId) ?? records[0] ?? null;
        } catch {
            return null;
        }
    },
    
    initiatePayment: async (request: InitiatePaymentRequest): Promise<EnrollmentPaymentDto> => {
        const pMethod = request.paymentMethod || request.method || 'ONLINE_GATEWAY';
        const response = await apiClient.post('/finance/payment-sessions', {
            invoiceId: request.assessmentId,
            applicantId: request.applicantId || 'APP-2026-0042',
            amount: request.amount,
            purpose: 'Admissions Downpayment'
        });
        const data = response.data;
        const sessionId = data?.sessionId || data?.SessionId || `PAY-${Date.now()}`;
        return {
            paymentId: sessionId,
            assessmentId: request.assessmentId,
            applicantId: request.applicantId || 'APP-2026-0042',
            amount: request.amount,
            method: pMethod,
            paymentMethod: pMethod,
            status: 'PAYMENT_PENDING',
            referenceNumber: data?.checkoutUrl || sessionId,
            transactionReference: data?.checkoutUrl || sessionId,
            paidAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
    },

    getPaymentStatus: async (paymentId: string): Promise<EnrollmentPaymentDto> => {
        const response = await apiClient.get(`/finance/payment-sessions/${paymentId}`);
        const data = response.data;
        const status = data?.Status || data?.status;
        const isVerified = status === 'Completed' || status === 'Paid';
        return {
            paymentId: data?.SessionId || data?.sessionId || paymentId,
            assessmentId: data?.InvoiceId || data?.invoiceId || 'ASS-2026',
            applicantId: data?.ApplicantId || data?.applicantId || 'APP-2026-0042',
            amount: Number(data?.Amount ?? data?.amount ?? 0),
            method: 'ONLINE_GATEWAY',
            paymentMethod: 'ONLINE_GATEWAY',
            status: isVerified ? 'PAYMENT_VERIFIED' : 'PAYMENT_PENDING',
            referenceNumber: data?.SessionId || data?.sessionId || paymentId,
            transactionReference: data?.SessionId || data?.sessionId || paymentId,
            paidAt: data?.CreatedAtUtc || data?.createdAtUtc || new Date().toISOString(),
            createdAt: data?.CreatedAtUtc || data?.createdAtUtc || new Date().toISOString()
        };
    },

    completePayment: async (paymentId: string): Promise<boolean> => {
        const response = await apiClient.post(`/finance/payment-sessions/${paymentId}/complete`);
        return response.status === 200;
    }
};
