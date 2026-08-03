import { useQuery } from '@tanstack/react-query';
import { guidanceApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
export const useGuidanceSessions = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['guidanceSessions', user?.id],
        queryFn: () => guidanceApi.getSessions(user.id),
        enabled: !!user?.id,
    });
};
