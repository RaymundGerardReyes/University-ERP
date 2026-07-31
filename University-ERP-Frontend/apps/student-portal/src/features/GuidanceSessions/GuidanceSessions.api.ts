import { guidanceApi } from '@university-erp/api-clients';

export const fetchGuidanceSessions = async (studentId: string) => {
  return guidanceApi.getSessions(studentId);
};
