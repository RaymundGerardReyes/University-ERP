import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchApplicantDashboard } from './Dashboard.api';

export const useApplicantDashboard = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['applicantDashboard', user?.id],
        queryFn: () => fetchApplicantDashboard(user!.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
    });
};