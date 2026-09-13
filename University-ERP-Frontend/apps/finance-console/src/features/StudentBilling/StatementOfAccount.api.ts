import { apiClient } from '@university-erp/api-clients';
import { StudentAccountSummary, StatementOfAccountDetail } from './StatementOfAccount.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const statementApi = {
  getAccountSummaries: async (semesterId?: string): Promise<StudentAccountSummary[]> => {
    const response = await apiClient.get<StudentAccountSummary[]>('/finance/statements/summaries', {
      params: semesterId ? { semesterId } : undefined,
    });
    return toSafeArray<StudentAccountSummary>(response.data);
  },

  getStatementDetail: async (studentId: string): Promise<StatementOfAccountDetail> => {
    const response = await apiClient.get<StatementOfAccountDetail>(`/finance/statements/${studentId}`);
    return response.data;
  },

  postAdjustment: async (studentId: string, payload: { amount: number; reason: string; type: 'DEBIT' | 'CREDIT' }): Promise<void> => {
    await apiClient.post(`/finance/statements/${studentId}/adjustments`, payload);
  },
};
