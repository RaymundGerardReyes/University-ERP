import { useQuery } from '@tanstack/react-query';
import { researchApi, ResearchGrant, Publication } from '@university-erp/api-clients';

export const useResearchPortfolio = (facultyId?: string) => {
    return useQuery({
        queryKey: ['researchPortfolio', facultyId],
        queryFn: () => researchApi.getPortfolio(facultyId!),
        enabled: !!facultyId
    });
};

export type { ResearchGrant, Publication };
