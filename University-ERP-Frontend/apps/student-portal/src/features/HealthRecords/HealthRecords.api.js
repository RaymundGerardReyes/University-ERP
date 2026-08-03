import { healthCenterApi } from '@university-erp/api-clients';
export const fetchHealthAppointments = async (studentId) => {
    return healthCenterApi.getAppointments(studentId);
};
