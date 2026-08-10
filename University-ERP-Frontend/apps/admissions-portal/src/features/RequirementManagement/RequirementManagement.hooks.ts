import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requirementManagementApi } from './RequirementManagement.api';
import { VerifyRequirementRequest } from './RequirementManagement.types';

export const useApplicantRequirements = (applicantId: string) => {
    return useQuery({
        queryKey: ['admissions', 'requirements', applicantId],
        queryFn: () => requirementManagementApi.getApplicantRequirements(applicantId),
        enabled: !!applicantId
    });
};

export const useVerifyRequirement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: VerifyRequirementRequest) => requirementManagementApi.verifyRequirement(request),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admissions', 'requirements'] });
        }
    });
};
