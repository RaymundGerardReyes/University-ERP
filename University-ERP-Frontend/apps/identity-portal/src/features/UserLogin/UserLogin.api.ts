import { identityApi } from '@university-erp/api-clients';
import { UserLoginCredentials } from './UserLogin.types';

export const submitLogin = async (credentials: UserLoginCredentials) => {
  return identityApi.login(credentials);
};
