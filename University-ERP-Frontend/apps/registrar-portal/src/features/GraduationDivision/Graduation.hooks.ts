import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGraduationCandidates, evaluateCandidate } from './Graduation.api';

export const useGraduationCandidates = () => {
    return useQuery({
        queryKey: ['registrar', 'graduationCandidates'],
        queryFn: fetchGraduationCandidates
    });
};

export const useEvaluateCandidate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: evaluateCandidate,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['registrar', 'graduationCandidates'] })
    });
};
