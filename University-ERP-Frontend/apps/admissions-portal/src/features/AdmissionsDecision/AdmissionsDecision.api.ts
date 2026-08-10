import { apiClient } from '@university-erp/api-clients';
import { AdmissionsDecisionDto, MakeDecisionRequest } from './AdmissionsDecision.types';

export const admissionsDecisionApi = {
    getPendingDecisions: async (): Promise<any[]> => {
        const response = await apiClient.get('/api/admissions/decisions/pending');
        return response.data;
    },
    
    makeDecision: async (request: MakeDecisionRequest): Promise<AdmissionsDecisionDto> => {
        const response = await apiClient.post('/api/admissions/decisions', request);
        return response.data;
    }
};
