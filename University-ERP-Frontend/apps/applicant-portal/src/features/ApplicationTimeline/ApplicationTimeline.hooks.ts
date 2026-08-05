import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchApplicationTimeline } from './ApplicationTimeline.api';

export const useApplicationTimeline = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['applicationTimeline', user?.id],
        queryFn: () => fetchApplicationTimeline(user!.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
    });
};