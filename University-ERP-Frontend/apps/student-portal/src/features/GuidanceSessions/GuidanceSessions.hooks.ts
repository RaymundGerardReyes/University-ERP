import { useQuery } from '@tanstack/react-query';
import { fetchGuidanceSessions } from './GuidanceSessions.api';

export const useGuidanceSessions = (studentId?: string) => {
  return useQuery({
    queryKey: ['guidanceSessions', studentId],
    queryFn: () => fetchGuidanceSessions(studentId!),
    enabled: !!studentId
  });
};
