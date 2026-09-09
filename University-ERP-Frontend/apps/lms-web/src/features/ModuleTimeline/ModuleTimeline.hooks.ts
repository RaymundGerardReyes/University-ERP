import { useQuery } from '@tanstack/react-query';
import { moduleTimelineApi } from './ModuleTimeline.api';

export function useModuleTimeline(courseCode?: string) {
  return useQuery({
    queryKey: ['moduleTimeline', courseCode],
    queryFn: () => moduleTimelineApi.getTimeline(courseCode)
  });
}
