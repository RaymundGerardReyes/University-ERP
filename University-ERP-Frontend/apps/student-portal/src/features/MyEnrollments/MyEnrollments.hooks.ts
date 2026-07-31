import { useQuery } from '@tanstack/react-query';
import { fetchEnrollments } from './MyEnrollments.api';

export const useMyEnrollments = (studentId?: string) => {
  return useQuery({
    queryKey: ['enrollments', studentId],
    queryFn: () => fetchEnrollments(studentId!),
    enabled: !!studentId
  });
};
