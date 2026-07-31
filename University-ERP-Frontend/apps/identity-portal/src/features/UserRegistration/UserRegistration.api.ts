import { identityApi } from '@university-erp/api-clients';
import { UserRegistrationData } from './UserRegistration.types';

export const submitRegistration = async (data: UserRegistrationData) => {
  return identityApi.register(data);
};
