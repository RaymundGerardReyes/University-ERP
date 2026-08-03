import { admissionsApi } from '@university-erp/api-clients';
export const fetchAdmissionStatus = async (studentId) => {
    return admissionsApi.getApplicationStatus(studentId);
};
