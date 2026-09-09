import { lmsApi, OfflineSubmissionDto } from '@university-erp/api-clients';
import { GradeSubmissionPayload } from './SubmissionReview.types';

export const submissionReviewApi = {
  getSubmissions: async (status?: string): Promise<OfflineSubmissionDto[]> => {
    return await lmsApi.getOfflineSubmissions(status);
  },
  gradeSubmission: async (payload: GradeSubmissionPayload): Promise<OfflineSubmissionDto> => {
    return await lmsApi.gradeSubmission(payload.submissionId, { score: payload.score, feedback: payload.feedback });
  }
};
