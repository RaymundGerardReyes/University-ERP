import { identityApi } from '@university-erp/api-clients';

export const requestPasswordReset = async (email: string) => {
  return identityApi.requestPasswordReset(email);
};
