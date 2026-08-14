import { apiClient } from '@university-erp/api-clients';

export interface PaymentSessionRecord {
  sessionId: string;
  invoiceId: string;
  applicantId: string;
  amount: number;
  currency: string;
  status: string;
  bankReference?: string;
  createdAtUtc: string;
  consumedAtUtc?: string;
}

export const paymentGatewayApi = {
  getAllSessions: async (): Promise<PaymentSessionRecord[]> => {
    const response = await apiClient.get('/api/v1/finance/payment-sessions');
    return response.data;
  }
};
