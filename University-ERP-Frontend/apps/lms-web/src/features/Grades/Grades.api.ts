import { lmsApi } from '@university-erp/api-clients';

export const gradesApi = {
  getGrades: async (studentId?: string) => {
    return await lmsApi.getGrades(studentId);
  }
};
