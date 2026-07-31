import { healthCenterApi } from '@university-erp/api-clients';

export const fetchHealthAppointments = async (studentId: string) => {
  return healthCenterApi.getAppointments(studentId);
};
