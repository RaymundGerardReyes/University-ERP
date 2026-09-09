import { useQuery } from '@tanstack/react-query';
import { clearanceApi } from './Clearance.api';

export function useStudentClearance(studentId: string) {
  return useQuery({
    queryKey: ['myClearance', studentId],
    queryFn: () => clearanceApi.getStudentClearance(studentId),
    enabled: !!studentId
  });
}
