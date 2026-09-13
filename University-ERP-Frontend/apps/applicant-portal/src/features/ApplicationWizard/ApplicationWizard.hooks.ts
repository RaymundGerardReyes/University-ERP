import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProgramCatalog, submitNewApplication } from './ApplicationWizard.api';

export const useProgramCatalog = () => {
  return useQuery({
    queryKey: ['programCatalog'],
    queryFn: fetchProgramCatalog,
  });
};

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => submitNewApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicantJourney'] });
      queryClient.invalidateQueries({ queryKey: ['admissionStatus'] });
      queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
    },
  });
};