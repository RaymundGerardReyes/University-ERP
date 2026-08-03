import { useMutation } from '@tanstack/react-query';
import { financeApi } from '@university-erp/api-clients';
export const useIssueInvoice = () => {
    return useMutation({
        mutationFn: (payload) => financeApi.issueInvoice(payload),
    });
};
