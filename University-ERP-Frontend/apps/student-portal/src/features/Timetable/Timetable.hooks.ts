import { useQuery } from '@tanstack/react-query';
import { timetableApi } from './Timetable.api';

export function useTimetable(studentId: string) {
  return useQuery({
    queryKey: ['student', 'timetable', studentId],
    queryFn: () => timetableApi.getTimetable(studentId),
    enabled: !!studentId
  });
}
