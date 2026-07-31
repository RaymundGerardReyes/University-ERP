import { studentInformationApi } from '@university-erp/api-clients';

export const fetchStudentProfile = async (studentId: string) => {
  return studentInformationApi.getProfile(studentId);
};
