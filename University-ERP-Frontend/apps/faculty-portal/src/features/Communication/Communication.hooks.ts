import { useQuery } from '@tanstack/react-query';
import { communicationApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useInbox = () => {
    const { identity } = useAuth();
    return useQuery({
        queryKey: ['inbox', identity?.id],
        queryFn: () => communicationApi.getInbox(identity?.id || 'FAC-001'),
        enabled: !!identity?.id,
    });
};