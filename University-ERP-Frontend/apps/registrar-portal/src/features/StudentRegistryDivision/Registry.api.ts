import { registrarApi } from '@university-erp/api-clients';

export const fetchMasterStudents = async () => {
    return registrarApi.getMasterStudents();
};
