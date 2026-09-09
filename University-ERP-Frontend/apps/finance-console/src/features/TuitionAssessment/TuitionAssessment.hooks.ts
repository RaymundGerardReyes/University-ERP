import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tuitionAssessmentApi } from './TuitionAssessment.api';
import { PerformAssessmentPayload } from './TuitionAssessment.types';

export const ASSESSMENT_KEY = ['finance', 'assessments', 'candidates'];

export function useAssessmentCandidates() {
  return useQuery({
    queryKey: ASSESSMENT_KEY,
    queryFn: () => tuitionAssessmentApi.getCandidates()
  });
}

export function usePerformAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PerformAssessmentPayload) => tuitionAssessmentApi.performAssessment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEY });
    }
  });
}
