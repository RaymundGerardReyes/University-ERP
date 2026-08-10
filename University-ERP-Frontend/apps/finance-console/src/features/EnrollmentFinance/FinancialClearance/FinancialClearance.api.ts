import { apiClient } from '@university-erp/api-clients';
import { FinancialClearanceDto, IssueClearanceRequest } from './FinancialClearance.types';

export const financialClearanceApi = {
    getPendingClearances: async (): Promise<any[]> => {
        const response = await apiClient.get('/api/finance/enrollment/clearances/pending');
        return response.data;
    },
    
    issueClearance: async (request: IssueClearanceRequest): Promise<FinancialClearanceDto> => {
        const response = await apiClient.post('/api/finance/enrollment/clearances/issue', request);
        return response.data;
    }
};
