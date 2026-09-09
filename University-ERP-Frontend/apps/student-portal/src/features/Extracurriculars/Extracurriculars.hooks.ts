import { useQuery } from '@tanstack/react-query';
import { extracurricularsApi } from './Extracurriculars.api';

export function useStudentClubs(studentId: string) {
  return useQuery({
    queryKey: ['student', 'extracurriculars', studentId],
    queryFn: () => extracurricularsApi.getMyClubs(studentId),
    enabled: !!studentId
  });
}
