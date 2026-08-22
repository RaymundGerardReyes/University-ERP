import axios from 'axios';
import { GeneratePayslipPayload, GeneratePayslipResponse, IssueInvoicePayload, IssueInvoiceResponse } from '@university-erp/domain-viewmodels';
import { apiClient } from '../apiClient';

export interface CreatePaymentSessionRequest {
  invoiceId: string;
  applicantId: string;
  amount: number;
  purpose: string;
  currency?: string;
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
    const token = localStorage.getItem('global_identity_token');
    
    // Use relative endpoint matching apiClient baseURL ('/api/v1')
    const response = await apiClient.post<{ sessionId: string, checkoutUrl: string }>(
      'finance/payment-sessions', 
      payload,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );
    return response.data;
  },

  getDynamicQR: async (sessionId: string): Promise<{ qrPayload: string }> => {
    const response = await apiClient.get<{ qrPayload: string }>(
      `finance/payment-sessions/${sessionId}/qr`
    );
    return response.data;
  },

  validateSession: async (sessionId: string): Promise<PaymentSessionDto> => {
    const response = await apiClient.get<PaymentSessionDto>(
      `finance/payment-sessions/${sessionId}`
    );
    return response.data;
  },

  getAllSessions: async (): Promise<any[]> => {
    const response = await apiClient.get('finance/payment-sessions');
    return response.data;
  },

  reconcileSession: async (sessionId: string, payload: { cashierId: string, remarks: string }): Promise<void> => {
    const response = await apiClient.post(`finance/payment-sessions/${sessionId}/reconcile`, payload);
    return response.data;
  }
};

const BASE_URL_PAYROLL = '/api/v1/payroll';
const BASE_URL_FINANCE = '/api/v1/finance';

export const financeApi = {
  generatePayslip: async (payload: GeneratePayslipPayload): Promise<GeneratePayslipResponse> => {
    try {
      const response = await axios.post<GeneratePayslipResponse>(`${BASE_URL_PAYROLL}/payslips`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  issueInvoice: async (payload: IssueInvoicePayload): Promise<IssueInvoiceResponse> => {
    try {
      const response = await axios.post<IssueInvoiceResponse>(`${BASE_URL_FINANCE}/invoices`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getInvoices: async (): Promise<any[]> => {
    try {
      const response = await axios.get(`${BASE_URL_FINANCE}/invoices`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoices', error);
      throw error;
    }
  },

  createPaymentSession: financePaymentSessionApi.createSession
};


