import { studentInformationApi } from '@university-erp/api-clients';
export const fetchStudentProfile = async (studentId) => {
    return studentInformationApi.getProfile(studentId);
};
