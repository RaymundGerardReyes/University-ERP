import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchClassGradebook, submitSectionGrades } from './Assessments.api';

export const useGradebook = (sectionId: string) => {
    return useQuery({
        queryKey: ['gradebook', sectionId],
        queryFn: () => fetchClassGradebook(sectionId),
        enabled: !!sectionId,
    });
};

export const useSubmitGrades = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ sectionId, payload }: { sectionId: string, payload: any }) => submitSectionGrades(sectionId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['gradebook', variables.sectionId] });
        }
    });
};