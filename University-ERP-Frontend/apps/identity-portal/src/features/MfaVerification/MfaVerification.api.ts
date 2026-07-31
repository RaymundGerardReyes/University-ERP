import { identityApi } from '@university-erp/api-clients';

export const verifyMfaCode = async (code: string) => {
  return identityApi.verifyMfa(code);
};
