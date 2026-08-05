import { communicationApi } from '@university-erp/api-clients';

export const fetchFacultyInbox = async (facultyId: string) => {
    return communicationApi.getInbox(facultyId);
};