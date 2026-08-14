import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';

export const useSubjectCatalog = () => {
    return useQuery({
        queryKey: ['registrar', 'curriculum', 'catalog'],
        queryFn: () => registrarApi.getSubjectCatalog()
    });
};

export const useCourses = () => {
    return useQuery({
        queryKey: ['registrar', 'curriculum', 'catalog'],
        queryFn: () => registrarApi.getSubjectCatalog()
    });
};

export const useUpdatePrerequisite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, ruleId, isEnforced }: { courseId: string, ruleId: string, isEnforced: boolean }) => 
            registrarApi.togglePrerequisiteEnforcement(courseId, ruleId, isEnforced),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrar', 'curriculum', 'catalog'] });
        }
    });
};

export const useUpdateMasterData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, payload }: { courseId: string, payload: any }) => 
            registrarApi.updateSubjectMasterData(courseId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrar', 'curriculum', 'catalog'] });
        }
    });
};