import { useQuery } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useApplicantDashboard = () => {
    const { identity } = useAuth();
    
    return useQuery({
        queryKey: ['applicant-journey', identity?.id],
        // Dynamically fetch the journey state from the PostgreSQL backend
        queryFn: () => admissionsApi.getApplicantJourney(identity?.id || ''),
        enabled: !!identity?.id,
        refetchInterval: 10000 // Poll every 10 seconds to catch real-time workflow advancements
    });
};