import { admissionsApi } from '@university-erp/api-clients';

export const fetchProgramCatalog = async () => {
    return admissionsApi.getProgramCatalog();
};

export const submitNewApplication = async (data: any) => {
    return admissionsApi.submitApplication(data);
};