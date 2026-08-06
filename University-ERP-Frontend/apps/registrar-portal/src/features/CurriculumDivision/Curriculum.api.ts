import { registrarApi } from '@university-erp/api-clients';

export const fetchSubjectCatalog = async () => {
    return registrarApi.getSubjectCatalog();
};
