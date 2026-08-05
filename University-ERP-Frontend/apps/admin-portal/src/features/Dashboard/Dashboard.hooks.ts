import { useQuery } from '@tanstack/react-query';
import { fetchAdminDashboardMetrics } from './Dashboard.api';

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ['adminDashboardMetrics'],
        queryFn: fetchAdminDashboardMetrics,
        staleTime: 1000 * 60, // Refresh every minute
    });
};