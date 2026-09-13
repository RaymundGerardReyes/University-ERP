import { apiClient } from '@university-erp/api-clients';
import { ClearanceCandidate } from './ClearanceApproval.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const clearanceApi = {
  getCandidates: async (term?: string): Promise<ClearanceCandidate[]> => {
    const response = await apiClient.get<ClearanceCandidate[]>('/finance/clearance/candidates', {
      params: { term },
    });
    return toSafeArray<ClearanceCandidate>(response.data);
  },

  approveClearance: async (candidateId: string): Promise<ClearanceCandidate> => {
    const response = await apiClient.post<ClearanceCandidate>(`/finance/clearance/candidates/${candidateId}/approve`);
    return response.data;
  },

  rejectClearance: async (candidateId: string, reason: string): Promise<ClearanceCandidate> => {
    const response = await apiClient.post<ClearanceCandidate>(`/finance/clearance/candidates/${candidateId}/reject`, { reason });
    return response.data;
  },
};
