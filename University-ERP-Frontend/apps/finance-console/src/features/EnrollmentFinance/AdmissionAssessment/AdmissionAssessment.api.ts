import { apiClient } from '@university-erp/api-clients';
import { AdmissionAssessmentDto, GenerateAssessmentRequest } from './AdmissionAssessment.types';
import { toSafeArray } from '../../../utils/arrayUtils';

export const admissionAssessmentApi = {
    getPendingAssessments: async (): Promise<AdmissionAssessmentDto[]> => {
        const response = await apiClient.get<AdmissionAssessmentDto[]>('/finance/enrollment/assessments/pending');
        return toSafeArray<AdmissionAssessmentDto>(response.data);
    },
    
    generateAssessment: async (request: GenerateAssessmentRequest): Promise<AdmissionAssessmentDto> => {
        const response = await apiClient.post<AdmissionAssessmentDto>('/finance/enrollment/assessments', request);
        return response.data;
    },
    
    publishAssessment: async (assessmentId: string): Promise<void> => {
        await apiClient.post(`/finance/enrollment/assessments/${assessmentId}/publish`);
    }
};
