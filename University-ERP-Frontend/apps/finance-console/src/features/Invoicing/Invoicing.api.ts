import { apiClient, financeApi } from '@university-erp/api-clients';
import { InvoiceDto, IssueInvoicePayload, IssueInvoiceResponse } from './Invoicing.types';

export const invoicingApi = {
  getAllInvoices: async (termId?: string): Promise<InvoiceDto[]> => {
    try {
      const response = await apiClient.get<InvoiceDto[]>('/api/v1/finance/invoices', {
        params: termId ? { termId } : undefined
      });
      return response.data;
    } catch {
      // Fallback to legacy financeApi
      return (await financeApi.getInvoices()) as InvoiceDto[];
    }
  },

  issueInvoice: async (payload: IssueInvoicePayload): Promise<IssueInvoiceResponse> => {
    try {
      const response = await apiClient.post<IssueInvoiceResponse>('/api/v1/finance/invoices', payload);
      return response.data;
    } catch {
      return (await financeApi.issueInvoice({
        studentId: payload.studentId,
        amount: payload.amount,
        description: payload.description
      })) as IssueInvoiceResponse;
    }
  }
};
