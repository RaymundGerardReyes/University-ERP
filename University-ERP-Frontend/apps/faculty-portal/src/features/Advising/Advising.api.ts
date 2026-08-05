import { advisingApi } from '@university-erp/api-clients';

export const fetchFacultyAdvisees = async (facultyId: string) => {
    return advisingApi.getAdvisees(facultyId);
};