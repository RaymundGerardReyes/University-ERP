import { useMutation } from '@tanstack/react-query';
import { financeApi } from '@university-erp/api-clients';
import { IssueInvoicePayload } from '@university-erp/domain-viewmodels';

export const useIssueInvoice = () => {
    return useMutation({
        mutationFn: (payload: IssueInvoicePayload) => financeApi.issueInvoice(payload),
    });
};
