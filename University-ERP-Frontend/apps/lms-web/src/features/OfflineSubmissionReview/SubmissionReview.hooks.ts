import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionReviewApi } from './SubmissionReview.api';
import { GradeSubmissionPayload } from './SubmissionReview.types';

export function useOfflineSubmissions(status?: string) {
  return useQuery({
    queryKey: ['offlineSubmissions', status],
    queryFn: () => submissionReviewApi.getSubmissions(status)
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GradeSubmissionPayload) => submissionReviewApi.gradeSubmission(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offlineSubmissions'] });
    }
  });
}
