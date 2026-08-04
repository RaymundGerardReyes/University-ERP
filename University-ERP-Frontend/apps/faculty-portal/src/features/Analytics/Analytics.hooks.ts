import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useClassPerformance = () => {
    const { identity } = useAuth();
    return useQuery({
        queryKey: ['classPerformance', identity?.id],
        queryFn: () => analyticsApi.getClassPerformance(identity?.id || 'FAC-001'),
        enabled: !!identity?.id,
    });
};