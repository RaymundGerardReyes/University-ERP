import { apiClient } from '@university-erp/api-clients';
import { HandoffDto, ExecuteHandoffRequest } from './EnrollmentHandoff.types';

export const enrollmentHandoffApi = {
    getApprovedApplicants: async (): Promise<any[]> => {
        const response = await apiClient.get('/api/admissions/handoff/approved');
        return response.data;
    },
    
    executeHandoff: async (request: ExecuteHandoffRequest): Promise<HandoffDto> => {
        const response = await apiClient.post('/api/admissions/handoff/execute', request);
        return response.data;
    }
};
