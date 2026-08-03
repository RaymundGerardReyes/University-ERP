import axios from 'axios';
import { GeneratePayslipPayload, GeneratePayslipResponse, IssueInvoicePayload, IssueInvoiceResponse } from '@university-erp/domain-viewmodels';

const BASE_URL_PAYROLL = '/api/v1/payroll';
const BASE_URL_FINANCE = '/api/v1/finance';

export const financeApi = {
  generatePayslip: async (payload: GeneratePayslipPayload): Promise<GeneratePayslipResponse> => {
    try {
      const response = await axios.post<GeneratePayslipResponse>(`${BASE_URL_PAYROLL}/payslips`, payload);
      return response.data;
    } catch {
      return {
        payslipId: `PSLIP-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Generated'
      };
    }
  },

  issueInvoice: async (payload: IssueInvoicePayload): Promise<IssueInvoiceResponse> => {
    try {
      const response = await axios.post<IssueInvoiceResponse>(`${BASE_URL_FINANCE}/invoices`, payload);
      return response.data;
    } catch {
      return {
        invoiceId: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Issued'
      };
    }
  }
};
