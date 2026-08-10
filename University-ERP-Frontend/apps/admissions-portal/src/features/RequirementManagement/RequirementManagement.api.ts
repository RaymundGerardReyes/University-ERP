import { apiClient } from '@university-erp/api-clients';
import { RequirementDto, VerifyRequirementRequest } from './RequirementManagement.types';

export const requirementManagementApi = {
    getApplicantRequirements: async (applicantId: string): Promise<RequirementDto[]> => {
        const response = await apiClient.get(`/api/admissions/requirements/${applicantId}`);
        return response.data;
    },
    
    verifyRequirement: async (request: VerifyRequirementRequest): Promise<RequirementDto> => {
        const response = await apiClient.post(`/api/admissions/requirements/${request.requirementId}/verify`, request);
        return response.data;
    }
};
