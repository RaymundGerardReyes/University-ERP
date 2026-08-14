import { useQuery } from '@tanstack/react-query';
import { lmsApi } from '@university-erp/api-clients';

export const useCourseContent = (sectionId: string) => {
    return useQuery({
        queryKey: ['student', 'lms', 'course-content', sectionId],
        queryFn: () => lmsApi.getCourseContent(sectionId),
        enabled: !!sectionId,
        staleTime: 1000 * 60 * 5 // Cache for 5 minutes
    });
};
