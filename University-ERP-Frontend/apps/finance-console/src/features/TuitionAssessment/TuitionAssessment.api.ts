import { apiClient } from '@university-erp/api-clients';
import { AssessmentStudentDto, PerformAssessmentPayload } from './TuitionAssessment.types';

export const tuitionAssessmentApi = {
  getCandidates: async (): Promise<AssessmentStudentDto[]> => {
    try {
      const response = await apiClient.get<AssessmentStudentDto[]>('/api/v1/finance/assessments/candidates');
      return response.data;
    } catch {
      return [];
    }
  },

  performAssessment: async (payload: PerformAssessmentPayload): Promise<{ assessmentId: string }> => {
    const response = await apiClient.post<{ assessmentId: string }>('/api/v1/finance/assessments', payload);
    return response.data;
  }
};
