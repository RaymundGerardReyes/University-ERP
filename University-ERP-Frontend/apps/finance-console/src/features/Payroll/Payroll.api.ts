import { apiClient, financeApi } from '@university-erp/api-clients';
import { GeneratePayslipPayload, GeneratePayslipResponse, PayrollRecordDto } from './Payroll.types';

export const payrollApi = {
  getPayrollHistory: async (payPeriod?: string): Promise<PayrollRecordDto[]> => {
    try {
      const response = await apiClient.get<PayrollRecordDto[]>('/api/v1/payroll/records', {
        params: payPeriod ? { payPeriod } : undefined
      });
      return response.data;
    } catch {
      return [];
    }
  },

  generatePayslip: async (payload: GeneratePayslipPayload): Promise<GeneratePayslipResponse> => {
    return (await financeApi.generatePayslip(payload)) as GeneratePayslipResponse;
  }
};
