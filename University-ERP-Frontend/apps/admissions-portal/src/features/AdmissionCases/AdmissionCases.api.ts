import { apiClient } from '@university-erp/api-clients';
import { AdmissionCaseDto, AssignCaseRequest } from './AdmissionCases.types';

export const admissionCasesApi = {
    getActiveCases: async (): Promise<AdmissionCaseDto[]> => {
        const response = await apiClient.get('/api/admissions/cases/active');
        return response.data;
    },
    
    assignCase: async (request: AssignCaseRequest): Promise<AdmissionCaseDto> => {
        const response = await apiClient.post(`/api/admissions/cases/${request.caseId}/assign`, request);
        return response.data;
    }
};
