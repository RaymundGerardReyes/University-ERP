import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { payrollApi } from './Payroll.api';
import { GeneratePayslipPayload } from './Payroll.types';

export const PAYROLL_QUERY_KEY = ['finance', 'payroll'];

export function usePayrollRecords(payPeriod?: string) {
  return useQuery({
    queryKey: [...PAYROLL_QUERY_KEY, payPeriod || 'current'],
    queryFn: () => payrollApi.getPayrollHistory(payPeriod)
  });
}

export function useGeneratePayslip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GeneratePayslipPayload) => payrollApi.generatePayslip(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYROLL_QUERY_KEY });
    }
  });
}
