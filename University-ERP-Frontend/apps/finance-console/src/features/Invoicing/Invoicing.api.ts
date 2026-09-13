import { apiClient, financeApi } from '@university-erp/api-clients';
import { InvoiceDto, IssueInvoicePayload, IssueInvoiceResponse } from './Invoicing.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const invoicingApi = {
  getAllInvoices: async (termId?: string): Promise<InvoiceDto[]> => {
    try {
      const response = await apiClient.get<InvoiceDto[]>('/finance/invoices', {
        params: termId ? { termId } : undefined
      });
      return toSafeArray<InvoiceDto>(response.data);
    } catch {
      const res = await financeApi.getInvoices();
      return toSafeArray<InvoiceDto>(res);
    }
  },

  issueInvoice: async (payload: IssueInvoicePayload): Promise<IssueInvoiceResponse> => {
    try {
      const response = await apiClient.post<IssueInvoiceResponse>('/finance/invoices', payload);
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
