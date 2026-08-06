import { registrarApi } from '@university-erp/api-clients';

export const fetchAuditLogs = async () => {
    return registrarApi.getAuditLogs();
};
