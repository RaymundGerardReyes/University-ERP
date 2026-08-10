import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionCasesApi } from './AdmissionCases.api';
import { AssignCaseRequest } from './AdmissionCases.types';

export const useActiveCases = () => {
    return useQuery({
        queryKey: ['admissions', 'cases', 'active'],
        queryFn: admissionCasesApi.getActiveCases
    });
};

export const useAssignCase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: AssignCaseRequest) => admissionCasesApi.assignCase(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admissions', 'cases'] });
        }
    });
};
