import { apiClient } from '@university-erp/api-clients';
import { AdmissionAssessmentDto, GenerateAssessmentRequest } from './AdmissionAssessment.types';

export const admissionAssessmentApi = {
    getPendingAssessments: async (): Promise<AdmissionAssessmentDto[]> => {
        const response = await apiClient.get('/api/finance/enrollment/assessments/pending');
        return response.data;
    },
    
    generateAssessment: async (request: GenerateAssessmentRequest): Promise<AdmissionAssessmentDto> => {
        const response = await apiClient.post('/api/finance/enrollment/assessments', request);
        return response.data;
    },
    
    publishAssessment: async (assessmentId: string): Promise<void> => {
        await apiClient.post(`/api/finance/enrollment/assessments/${assessmentId}/publish`);
    }
};
