import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teachingApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useMyCourses = () => {
    const { identity } = useAuth();

    return useQuery({
        queryKey: ['myCourses', identity?.id],
        // Fallback to a mock ID if identity is not yet loaded
        queryFn: () => teachingApi.getMyCourses(identity?.id || 'FAC-001'),
        enabled: !!identity?.id,
    });
};

export const useSubmitAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ sectionId, data }: { sectionId: string, data: any }) =>
            teachingApi.submitAttendance(sectionId, data),
        onSuccess: () => {
            // Refresh any queries related to attendance or courses after submission
            queryClient.invalidateQueries({ queryKey: ['myCourses'] });
        }
    });
};