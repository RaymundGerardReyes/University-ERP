import { alumniApi } from '@university-erp/api-clients';

export const fetchAlumniStatus = async (studentId: string) => {
  return alumniApi.getAlumniStatus(studentId);
};
