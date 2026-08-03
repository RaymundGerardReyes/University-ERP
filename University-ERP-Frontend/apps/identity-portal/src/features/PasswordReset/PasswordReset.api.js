import { identityApi } from '@university-erp/api-clients';
export const requestPasswordReset = async (email) => {
    return identityApi.requestPasswordReset(email);
};
