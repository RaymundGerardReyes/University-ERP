import { identityApi } from '@university-erp/api-clients';
export const verifyMfaCode = async (code) => {
    return identityApi.verifyMfa(code);
};
