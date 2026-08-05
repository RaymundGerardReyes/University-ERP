import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchFacultySchedule } from './Schedule.api';

export const useWeeklySchedule = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['facultySchedule', user?.id],
        queryFn: () => fetchFacultySchedule(user!.id),
        enabled: !!user?.id,
    });
};