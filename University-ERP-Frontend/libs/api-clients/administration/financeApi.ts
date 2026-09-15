import { GeneratePayslipPayload, GeneratePayslipResponse, IssueInvoicePayload, IssueInvoiceResponse } from '@university-erp/domain-viewmodels';
import { apiClient } from '../apiClient';

export interface CreatePaymentSessionRequest {
  invoiceId: string;
  applicantId: string;
  amount: number;
  purpose: string;
  currency?: string;
  /** URL the payment gateway will redirect the browser to after checkout */
  returnUrl?: string;
}

export interface PaymentSessionResponse {
  sessionId: string;
}

export interface PaymentSessionDto {
  sessionId: string;
  status: string;
  amount: number;
  currency: string;
}

export const financePaymentSessionApi = {
  createSession: async (payload: CreatePaymentSessionRequest): Promise<{ sessionId: string, checkoutUrl: string }> => {
    const response = await apiClient.post<{ sessionId: string, checkoutUrl: string }>(
      '/finance/payment-sessions', 
      payload
    );
    return response.data;
  },

  getDynamicQR: async (sessionId: string): Promise<{ qrPayload: string }> => {
    const response = await apiClient.get<{ qrPayload: string }>(
      `/finance/payment-sessions/${sessionId}/qr`
    );
    return response.data;
  },

  validateSession: async (sessionId: string): Promise<PaymentSessionDto> => {
    const response = await apiClient.get<PaymentSessionDto>(
      `/finance/payment-sessions/${sessionId}`
    );
    return response.data;
  },

  getAllSessions: async (): Promise<any[]> => {
    const response = await apiClient.get('/finance/payment-sessions');
    return response.data;
  },

  reconcileSession: async (sessionId: string, payload: { cashierId: string, remarks: string }): Promise<void> => {
    const response = await apiClient.post(`/finance/payment-sessions/${sessionId}/reconcile`, payload);
    return response.data;
  }
};

export const financeApi = {
  generatePayslip: async (payload: GeneratePayslipPayload): Promise<GeneratePayslipResponse> => {
    const response = await apiClient.post<GeneratePayslipResponse>('/payroll/payslips', payload);
    return response.data;
  },

  issueInvoice: async (payload: IssueInvoicePayload): Promise<IssueInvoiceResponse> => {
    const response = await apiClient.post<IssueInvoiceResponse>('/finance/invoices', payload);
    return response.data;
  },

  getInvoices: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/finance/invoices');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoices', error);
      throw error;
    }
  },

  createPaymentSession: financePaymentSessionApi.createSession
};
