import { useQuery } from '@tanstack/react-query';
import { fetchCanteenMetrics } from './CanteenOrders.api';

export const useCanteenMetrics = () => {
    return useQuery({
        queryKey: ['adminCanteenMetrics'],
        queryFn: fetchCanteenMetrics,
        staleTime: 1000 * 60 * 2, // Live updates every 2 mins
    });
};