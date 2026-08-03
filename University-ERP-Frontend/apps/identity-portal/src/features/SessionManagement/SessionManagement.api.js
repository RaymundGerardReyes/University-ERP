import { identityApi } from '@university-erp/api-clients';
export const fetchSessions = async () => {
    return identityApi.getSessions();
};
