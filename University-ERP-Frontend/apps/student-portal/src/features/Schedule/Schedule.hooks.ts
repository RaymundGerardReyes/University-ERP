import { useQuery } from '@tanstack/react-query';
import { scheduleApi } from './Schedule.api';

export const useStudentSchedule = (studentId: string, semesterId: string) => {
    return useQuery({
        queryKey: ['student', studentId, 'schedule', semesterId],
        queryFn: () => scheduleApi.getStudentSchedule(studentId, semesterId),
        enabled: !!studentId && !!semesterId
    });
};
