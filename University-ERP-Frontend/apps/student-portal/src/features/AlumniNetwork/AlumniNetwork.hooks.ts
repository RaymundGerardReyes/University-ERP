import { useQuery } from '@tanstack/react-query';
import { fetchAlumniStatus } from './AlumniNetwork.api';

export const useAlumniStatus = (studentId?: string) => {
  return useQuery({
    queryKey: ['alumniStatus', studentId],
    queryFn: () => fetchAlumniStatus(studentId!),
    enabled: !!studentId
  });
};
