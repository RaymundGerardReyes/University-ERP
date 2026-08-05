import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchResearchData } from './Research.api';

export const useResearchPortfolio = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['researchPortfolio', user?.id],
        queryFn: () => fetchResearchData(user!.id),
        enabled: !!user?.id,
    });
};