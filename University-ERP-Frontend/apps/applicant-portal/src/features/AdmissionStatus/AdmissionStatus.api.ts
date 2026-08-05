import { admissionsApi } from '@university-erp/api-clients';

export const fetchAdmissionStatus = async (studentId: string) => {
  return admissionsApi.getApplicationStatus(studentId);
};