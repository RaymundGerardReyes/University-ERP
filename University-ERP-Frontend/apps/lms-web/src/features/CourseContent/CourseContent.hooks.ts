import { useQuery } from '@tanstack/react-query';
import { courseContentApi } from './CourseContent.api';

export function useCourseContent(sectionId: string) {
  return useQuery({
    queryKey: ['lmsCourseContent', sectionId],
    queryFn: () => courseContentApi.getContent(sectionId)
  });
}
