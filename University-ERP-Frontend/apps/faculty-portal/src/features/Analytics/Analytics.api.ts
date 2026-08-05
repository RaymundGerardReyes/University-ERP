import { analyticsApi } from '@university-erp/api-clients';

export const fetchClassAnalytics = async (facultyId: string) => {
    return analyticsApi.getClassPerformance(facultyId);
};