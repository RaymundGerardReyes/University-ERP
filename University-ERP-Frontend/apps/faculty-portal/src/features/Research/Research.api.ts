import { researchApi } from '@university-erp/api-clients';

export const fetchResearchData = async (facultyId: string) => {
    return researchApi.getPortfolio(facultyId);
};