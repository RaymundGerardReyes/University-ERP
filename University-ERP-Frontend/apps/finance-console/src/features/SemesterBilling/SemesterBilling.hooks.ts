import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { semesterBillingApi } from './SemesterBilling.api';

export const usePendingAssessments = (termId: string) => {
    return useQuery({
        queryKey: ['assessments', 'pending', termId],
        queryFn: () => semesterBillingApi.getPendingAssessments(termId),
        enabled: !!termId
    });
};

export const useFinalizeAssessment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (assessmentId: string) => semesterBillingApi.finalizeAssessment(assessmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessments'] });
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        }
    });
};