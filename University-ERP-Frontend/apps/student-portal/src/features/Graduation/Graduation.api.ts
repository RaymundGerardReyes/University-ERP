import { apiClient } from '@university-erp/api-clients';
import { GraduationApplicationDto, SubmitGraduationApplicationRequest } from './Graduation.types';

export const graduationApi = {
    getApplicationStatus: async (studentId: string): Promise<GraduationApplicationDto> => {
        const response = await apiClient.get(`/api/student/${studentId}/graduation/status`);
        return response.data;
    },
    
    submitApplication: async (request: SubmitGraduationApplicationRequest): Promise<GraduationApplicationDto> => {
        const response = await apiClient.post('/api/student/graduation/apply', request);
        return response.data;
    }
};
