import { alumniApi } from '@university-erp/api-clients';
export const fetchAlumniStatus = async (studentId) => {
    return alumniApi.getAlumniStatus(studentId);
};
