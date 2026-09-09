import { useQuery } from '@tanstack/react-query';
import { gradesApi } from './Grades.api';

export function useGrades(studentId?: string) {
  return useQuery({
    queryKey: ['lmsGrades', studentId],
    queryFn: () => gradesApi.getGrades(studentId)
  });
}
