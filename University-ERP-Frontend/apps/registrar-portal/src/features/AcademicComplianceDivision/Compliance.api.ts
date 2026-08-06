import { registrarApi } from '@university-erp/api-clients';

export const fetchCHEDReports = async () => {
    return registrarApi.getCHEDReports();
};
