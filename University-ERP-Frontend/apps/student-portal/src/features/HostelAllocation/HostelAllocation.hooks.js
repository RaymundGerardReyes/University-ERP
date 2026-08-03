import { useQuery } from '@tanstack/react-query';
import { fetchHostelAllocation } from './HostelAllocation.api';
export const useHostelAllocation = (studentId) => {
    return useQuery({
        queryKey: ['hostelAllocation', studentId],
        queryFn: () => fetchHostelAllocation(studentId),
        enabled: !!studentId
    });
};
