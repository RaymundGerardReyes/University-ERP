import { useQuery } from '@tanstack/react-query';
import { scheduleApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useWeeklySchedule = () => {
    const { identity } = useAuth();
    return useQuery({
        queryKey: ['weeklySchedule', identity?.id],
        queryFn: () => scheduleApi.getWeeklySchedule(identity?.id || 'FAC-001'),
        enabled: !!identity?.id,
    });
};