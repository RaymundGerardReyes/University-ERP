import { guidanceApi } from '@university-erp/api-clients';
export const fetchGuidanceSessions = async (studentId) => {
    return guidanceApi.getSessions(studentId);
};
