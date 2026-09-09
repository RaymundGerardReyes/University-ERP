import { useQuery } from '@tanstack/react-query';
import { discussionsApi } from './Discussions.api';

export function useDiscussions(courseId?: string) {
  return useQuery({
    queryKey: ['lmsDiscussions', courseId],
    queryFn: () => discussionsApi.getDiscussions(courseId)
  });
}
