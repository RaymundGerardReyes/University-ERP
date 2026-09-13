import { apiClient, financeApi } from '@university-erp/api-clients';
import { GeneratePayslipPayload, GeneratePayslipResponse, PayrollRecordDto } from './Payroll.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const payrollApi = {
  getPayrollHistory: async (payPeriod?: string): Promise<PayrollRecordDto[]> => {
    const response = await apiClient.get<PayrollRecordDto[]>('/payroll/records', {
      params: payPeriod ? { payPeriod } : undefined
    });
    return toSafeArray<PayrollRecordDto>(response.data);
  },

  generatePayslip: async (payload: GeneratePayslipPayload): Promise<GeneratePayslipResponse> => {
    return (await financeApi.generatePayslip(payload)) as GeneratePayslipResponse;
  },

  disbursePayroll: async (payload: { employeeId: string; destinationAccount: string; amount: number; payPeriod: string; }): Promise<{ success: boolean; transactionId?: string }> => {
    const response = await apiClient.post<{ success: boolean; transactionId?: string }>('/finance/payroll/disburse', payload);
    return response.data;
  }
};
