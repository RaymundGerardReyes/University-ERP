import { admissionsApi } from '@university-erp/api-clients';

export const fetchAcademicPrograms = async () => {
    return admissionsApi.getProgramCatalog();
};