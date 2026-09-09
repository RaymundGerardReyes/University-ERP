import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAccreditationStandards, submitAccreditationEvidence } from './Accreditation.api';

export const useAccreditationStandards = () => {
  return useQuery({
    queryKey: ['governance', 'accreditation', 'standards'],
    queryFn: fetchAccreditationStandards,
    staleTime: 60000
  });
};

export const useSubmitAccreditationEvidence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAccreditationEvidence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'accreditation'] });
    }
  });
};
