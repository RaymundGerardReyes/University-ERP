import { apiClient, financeApi } from '@university-erp/api-clients';
import { GeneratePayslipPayload, GeneratePayslipResponse, PayrollProcessingItem } from './PayrollProcessing.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const payrollProcessingApi = {
  generatePayslip: async (payload: GeneratePayslipPayload): Promise<GeneratePayslipResponse> => {
    return await financeApi.generatePayslip(payload);
  },

  getRecentRuns: async (): Promise<PayrollProcessingItem[]> => {
    const response = await apiClient.get<PayrollProcessingItem[]>('/payroll/runs');
    return toSafeArray<PayrollProcessingItem>(response.data);
  }
};
