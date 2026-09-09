import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoicingApi } from './Invoicing.api';
import { IssueInvoicePayload } from './Invoicing.types';

export const INVOICES_QUERY_KEY = ['finance', 'invoices'];

export function useInvoices(termId?: string) {
  return useQuery({
    queryKey: [...INVOICES_QUERY_KEY, termId || 'all'],
    queryFn: () => invoicingApi.getAllInvoices(termId)
  });
}

export function useIssueInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IssueInvoicePayload) => invoicingApi.issueInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
    }
  });
}
