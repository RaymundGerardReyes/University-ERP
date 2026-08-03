import { identityApi } from '@university-erp/api-clients';
export const submitLogin = async (credentials) => {
    return identityApi.login(credentials);
};
