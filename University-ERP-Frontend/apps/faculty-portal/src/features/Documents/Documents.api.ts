import { documentsApi } from '@university-erp/api-clients';

export const fetchFacultyDocuments = async (facultyId: string) => {
    return documentsApi.getDocuments(facultyId);
};