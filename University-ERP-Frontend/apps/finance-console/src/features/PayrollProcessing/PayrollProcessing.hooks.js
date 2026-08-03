import { useMutation } from '@tanstack/react-query';
import { financeApi } from '@university-erp/api-clients';
export const useGeneratePayslip = () => {
    return useMutation({
        mutationFn: (payload) => financeApi.generatePayslip(payload),
    });
};
