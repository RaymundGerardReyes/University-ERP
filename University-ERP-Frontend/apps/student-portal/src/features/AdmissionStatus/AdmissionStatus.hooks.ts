import { useQuery } from '@tanstack/react-query';
import { fetchAdmissionStatus } from './AdmissionStatus.api';

export const useAdmissionStatus = (studentId?: string) => {
  return useQuery({
    queryKey: ['admissions', studentId],
    queryFn: () => fetchAdmissionStatus(studentId!),
    enabled: !!studentId
  });
};
