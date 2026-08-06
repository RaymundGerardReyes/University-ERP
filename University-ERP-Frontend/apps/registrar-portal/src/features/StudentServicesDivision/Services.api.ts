import { registrarApi } from '@university-erp/api-clients';

export const fetchStudentInquiries = async () => {
    return registrarApi.getStudentInquiries();
};
