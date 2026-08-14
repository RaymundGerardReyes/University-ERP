import { useQuery } from '@tanstack/react-query';
import { teachingApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useMyCourses = () => {
    const { identity } = useAuth();

    return useQuery({
        // Cache uniquely by the faculty ID
        queryKey: ['faculty', 'courses', identity?.id],
        // Dynamically fetch from the backend via the API client
        queryFn: () => teachingApi.getMyCourses(identity?.id || ''),
        enabled: !!identity?.id,
        staleTime: 1000 * 60 * 15 // Cache for 15 minutes as schedules rarely change mid-day
    });
};