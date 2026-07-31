import { useQuery } from '@tanstack/react-query';
import { fetchHostelAllocation } from './HostelAllocation.api';

export const useHostelAllocation = (studentId?: string) => {
  return useQuery({
    queryKey: ['hostelAllocation', studentId],
    queryFn: () => fetchHostelAllocation(studentId!),
    enabled: !!studentId
  });
};
