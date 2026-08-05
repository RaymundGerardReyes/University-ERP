import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchFacultyDashboardData } from './Dashboard.api';

export const useFacultyDashboard = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['facultyDashboard', user?.id],
        queryFn: () => fetchFacultyDashboardData(user!.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
    });
};