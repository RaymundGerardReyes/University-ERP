import { useMutation } from '@tanstack/react-query';
import { financeApi } from '@university-erp/api-clients';
import { GeneratePayslipPayload } from '@university-erp/domain-viewmodels';

export const useGeneratePayslip = () => {
    return useMutation({
        mutationFn: (payload: GeneratePayslipPayload) => financeApi.generatePayslip(payload),
    });
};
