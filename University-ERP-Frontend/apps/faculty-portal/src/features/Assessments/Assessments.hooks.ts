import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assessmentApi } from '@university-erp/api-clients';

export const useGradebook = (sectionId: string) => {
    return useQuery({
        queryKey: ['gradebook', sectionId],
        queryFn: () => assessmentApi.getGradebook(sectionId),
        enabled: !!sectionId,
    });
};

export const useSubmitGrades = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ sectionId, payload }: { sectionId: string, payload: any }) =>
            assessmentApi.submitGrades(sectionId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['gradebook', variables.sectionId] });
        }
    });
};