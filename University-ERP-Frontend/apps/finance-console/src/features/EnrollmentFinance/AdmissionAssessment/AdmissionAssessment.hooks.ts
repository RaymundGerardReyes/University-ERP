import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionAssessmentApi } from './AdmissionAssessment.api';
import { GenerateAssessmentRequest } from './AdmissionAssessment.types';

export const useAdmissionAssessments = () => {
    return useQuery({
        queryKey: ['finance', 'assessments', 'pending'],
        queryFn: admissionAssessmentApi.getPendingAssessments
    });
};

export const useGenerateAssessment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: GenerateAssessmentRequest) => admissionAssessmentApi.generateAssessment(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'assessments', 'pending'] });
        }
    });
};

export const usePublishAssessment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (assessmentId: string) => admissionAssessmentApi.publishAssessment(assessmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'assessments', 'pending'] });
        }
    });
};
