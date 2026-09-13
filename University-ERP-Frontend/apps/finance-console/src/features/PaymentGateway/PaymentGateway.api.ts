import { apiClient } from '@university-erp/api-clients';
import { toSafeArray } from '../../utils/arrayUtils';

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
    const response = await apiClient.get<PaymentSessionRecord[]>('/finance/payment-sessions');
    return toSafeArray<PaymentSessionRecord>(response.data);
  }
};
