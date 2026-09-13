import { apiClient } from '@university-erp/api-clients';
import { AssessmentStudentDto, PerformAssessmentPayload } from './TuitionAssessment.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const tuitionAssessmentApi = {
  getCandidates: async (): Promise<AssessmentStudentDto[]> => {
    const response = await apiClient.get<AssessmentStudentDto[]>('/finance/assessments/candidates');
    return toSafeArray<AssessmentStudentDto>(response.data);
  },

  performAssessment: async (payload: PerformAssessmentPayload): Promise<{ assessmentId: string }> => {
    const response = await apiClient.post<{ assessmentId: string }>('/finance/assessments', payload);
    return response.data;
  },
};
