import { apiClient } from '@university-erp/api-clients';
import { CrossEnrollmentDto, SubmitCrossEnrollmentRequest } from './CrossEnrollment.types';

export const crossEnrollmentApi = {
    getRequests: async (studentId: string): Promise<CrossEnrollmentDto[]> => {
        const response = await apiClient.get(`/api/student/${studentId}/cross-enrollment`);
        return response.data;
    },
    
    submitRequest: async (request: SubmitCrossEnrollmentRequest): Promise<CrossEnrollmentDto> => {
        const response = await apiClient.post('/api/student/cross-enrollment/submit', request);
        return response.data;
    }
};
