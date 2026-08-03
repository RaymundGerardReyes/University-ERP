import { studentInformationApi } from '@university-erp/api-clients';
export const fetchEnrollments = async (studentId) => {
    return studentInformationApi.getEnrollmentHistory(studentId);
};
