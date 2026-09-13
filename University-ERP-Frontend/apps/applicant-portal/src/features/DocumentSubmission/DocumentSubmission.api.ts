import { admissionsApi, JourneyStateDto } from '@university-erp/api-clients';
import { UploadDocumentPayload } from './DocumentSubmission.types';

export const documentSubmissionApi = {
  getApplicantJourney: async (studentId: string): Promise<JourneyStateDto> => {
    return admissionsApi.getApplicantJourney(studentId);
  },

  uploadDocument: async (payload: UploadDocumentPayload): Promise<boolean> => {
    return admissionsApi.uploadDocument(payload.applicationId, {
      documentName: payload.documentName,
      filePath: payload.filePath,
    });
  },
};

// Backwards compatibility alias
export const uploadApplicantDocument = async (
  applicationId: string,
  data: { documentName: string; filePath: string }
) => {
  return documentSubmissionApi.uploadDocument({ applicationId, ...data });
};