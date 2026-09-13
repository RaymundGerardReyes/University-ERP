import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clearanceApi } from './ClearanceApproval.api';
import { ClearanceCandidate } from './ClearanceApproval.types';

import { toSafeArray } from '../../utils/arrayUtils';

export const useClearanceApproval = (term?: string) => {
  const queryClient = useQueryClient();

  const candidatesQuery = useQuery<ClearanceCandidate[], Error>({
    queryKey: ['clearance', 'candidates', term],
    queryFn: () => clearanceApi.getCandidates(term),
  });

  const approveMutation = useMutation({
    mutationFn: (candidateId: string) => clearanceApi.approveClearance(candidateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clearance', 'candidates'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ candidateId, reason }: { candidateId: string; reason: string }) =>
      clearanceApi.rejectClearance(candidateId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clearance', 'candidates'] });
    },
  });

  return {
    candidates: toSafeArray<ClearanceCandidate>(candidatesQuery.data),
    isLoading: candidatesQuery.isLoading,
    approveClearance: approveMutation.mutateAsync,
    rejectClearance: rejectMutation.mutateAsync,
    isProcessing: approveMutation.isPending || rejectMutation.isPending,
  };
};

