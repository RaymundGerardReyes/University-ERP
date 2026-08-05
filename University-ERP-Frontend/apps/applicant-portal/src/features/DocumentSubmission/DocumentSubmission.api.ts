import { admissionsApi } from '@university-erp/api-clients';

export const uploadApplicantDocument = async (applicationId: string, data: { documentName: string, filePath: string }) => {
    return admissionsApi.uploadDocument(applicationId, data);
};