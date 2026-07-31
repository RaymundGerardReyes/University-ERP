import { useQuery } from '@tanstack/react-query';
import { fetchHealthAppointments } from './HealthRecords.api';

export const useHealthRecords = (studentId?: string) => {
  return useQuery({
    queryKey: ['healthAppointments', studentId],
    queryFn: () => fetchHealthAppointments(studentId!),
    enabled: !!studentId
  });
};
