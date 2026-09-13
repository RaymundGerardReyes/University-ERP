import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { payrollProcessingApi } from './PayrollProcessing.api';
import { GeneratePayslipPayload } from './PayrollProcessing.types';

export const PAYROLL_PROCESSING_QUERY_KEY = ['finance', 'payroll-processing'];

export const useGeneratePayslip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GeneratePayslipPayload) => payrollProcessingApi.generatePayslip(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYROLL_PROCESSING_QUERY_KEY });
    }
  });
};

export const useRecentPayrollRuns = () => {
  return useQuery({
    queryKey: PAYROLL_PROCESSING_QUERY_KEY,
    queryFn: () => payrollProcessingApi.getRecentRuns()
  });
};
