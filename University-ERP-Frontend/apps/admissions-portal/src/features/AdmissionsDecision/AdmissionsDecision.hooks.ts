import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionsDecisionApi } from './AdmissionsDecision.api';
import { MakeDecisionRequest } from './AdmissionsDecision.types';

export const usePendingDecisions = () => {
    return useQuery({
        queryKey: ['admissions', 'decisions', 'pending'],
        queryFn: admissionsDecisionApi.getPendingDecisions
    });
};

export const useMakeDecision = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: MakeDecisionRequest) => admissionsDecisionApi.makeDecision(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admissions', 'decisions', 'pending'] });
            queryClient.invalidateQueries({ queryKey: ['admissions', 'cases', 'active'] });
        }
    });
};
