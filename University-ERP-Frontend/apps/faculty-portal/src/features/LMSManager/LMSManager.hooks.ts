import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lmsApi } from '@university-erp/api-clients';

export const useSyllabusContent = (sectionId: string) => {
    return useQuery({
        queryKey: ['faculty', 'lms', sectionId],
        queryFn: () => lmsApi.getCourseContent(sectionId),
        enabled: !!sectionId,
        retry: false // If 404, we want to show the "Create Syllabus" UI
    });
};

export const useCreateSyllabus = (sectionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => lmsApi.createSyllabus(sectionId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faculty', 'lms', sectionId] })
    });
};

export const useAddModule = (sectionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => lmsApi.addModule(sectionId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faculty', 'lms', sectionId] })
    });
};

export const useAddContent = (sectionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { moduleId: string, name: string, contentType: string, resourceUrl: string }) => 
            lmsApi.addContentItem(sectionId, payload.moduleId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faculty', 'lms', sectionId] })
    });
};
