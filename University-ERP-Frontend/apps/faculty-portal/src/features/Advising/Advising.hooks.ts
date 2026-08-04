import { useQuery } from '@tanstack/react-query';
import { advisingApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export const useAdvisees = () => {
    const { identity } = useAuth();
    return useQuery({
        queryKey: ['advisees', identity?.id],
        queryFn: () => advisingApi.getAdvisees(identity?.id || 'FAC-001'),
        enabled: !!identity?.id,
    });
};