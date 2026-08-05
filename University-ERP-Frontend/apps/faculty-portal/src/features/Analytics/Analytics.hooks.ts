import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchClassAnalytics } from './Analytics.api';

export const useClassAnalytics = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['classAnalytics', user?.id],
        queryFn: () => fetchClassAnalytics(user!.id),
        enabled: !!user?.id,
    });
};