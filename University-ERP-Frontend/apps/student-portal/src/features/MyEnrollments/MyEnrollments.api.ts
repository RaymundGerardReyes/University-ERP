import { studentInformationApi } from '@university-erp/api-clients';

export const fetchEnrollments = async (studentId: string) => {
  return studentInformationApi.getEnrollmentHistory(studentId);
};
