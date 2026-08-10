import { useQuery } from '@tanstack/react-query';
import { enrollmentHistoryApi } from './EnrollmentHistory.api';

export const useEnrollmentHistory = (studentId: string) => {
    return useQuery({
        queryKey: ['student', studentId, 'enrollment-history'],
        queryFn: () => enrollmentHistoryApi.getHistory(studentId),
        enabled: !!studentId
    });
};
