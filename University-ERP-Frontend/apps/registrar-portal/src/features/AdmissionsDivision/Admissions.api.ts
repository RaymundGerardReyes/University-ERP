import { registrarApi } from '@university-erp/api-clients';

export const fetchAdmissionsQueue = async () => {
    return registrarApi.getAdmissionsQueue();
};
