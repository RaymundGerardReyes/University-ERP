import { apiClient } from '@university-erp/api-clients';
import { FinancialClearanceDto, IssueClearanceRequest } from './FinancialClearance.types';
import { toSafeArray } from '../../../utils/arrayUtils';

export const financialClearanceApi = {
    getPendingClearances: async (): Promise<FinancialClearanceDto[]> => {
        const response = await apiClient.get<FinancialClearanceDto[]>('/finance/enrollment/clearance/candidates');
        return toSafeArray<FinancialClearanceDto>(response.data);
    },

    getClearanceCandidates: async (): Promise<any[]> => {
        const response = await apiClient.get<any[]>('/finance/enrollment/clearance/candidates');
        return toSafeArray<any>(response.data);
    },
    
    issueClearance: async (request: IssueClearanceRequest): Promise<void> => {
        await apiClient.post(`/finance/enrollment/clearance/${request.applicantId}/grant`, request);
    },

    grantClearance: async (applicantId: string): Promise<void> => {
        await apiClient.post(`/finance/enrollment/clearance/${applicantId}/grant`);
    }
};
