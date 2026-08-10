import { apiClient } from '@university-erp/api-clients';
import { IncomingCrossEnrolleeDto, ReviewCrossEnrolleeRequest } from './CrossEnrollmentDivision.types';

export const crossEnrollmentDivisionApi = {
    getIncomingRequests: async (): Promise<IncomingCrossEnrolleeDto[]> => {
        const response = await apiClient.get('/api/registrar/cross-enrollment/incoming');
        return response.data;
    },
    
    reviewRequest: async (request: ReviewCrossEnrolleeRequest): Promise<void> => {
        await apiClient.post(`/api/registrar/cross-enrollment/${request.crossEnrolleeId}/review`, request);
    }
};
