import { identityApi } from '@university-erp/api-clients';
export const submitRegistration = async (data) => {
    return identityApi.register(data);
};
