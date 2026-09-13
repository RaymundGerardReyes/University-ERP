import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scholarshipApi } from './Scholarships.api';
import { GrantApplication } from './Scholarships.types';

import { toSafeArray } from '../../utils/arrayUtils';

export const useScholarshipGrants = (semesterId?: string) => {
  const queryClient = useQueryClient();

  const applicationsQuery = useQuery<GrantApplication[], Error>({
    queryKey: ['scholarships', 'applications', semesterId],
    queryFn: () => scholarshipApi.getApplications(semesterId),
  });

  const schemesQuery = useQuery({
    queryKey: ['scholarships', 'schemes'],
    queryFn: () => scholarshipApi.getSchemes(),
  });

  const approveMutation = useMutation({
    mutationFn: ({ applicationId, approvedDiscountAmount }: { applicationId: string; approvedDiscountAmount: number }) =>
      scholarshipApi.approveApplication(applicationId, approvedDiscountAmount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scholarships', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ applicationId, reason }: { applicationId: string; reason: string }) =>
      scholarshipApi.rejectApplication(applicationId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scholarships', 'applications'] });
    },
  });

  return {
    applications: toSafeArray<GrantApplication>(applicationsQuery.data),
    schemes: toSafeArray(schemesQuery.data),
    isLoading: applicationsQuery.isLoading || schemesQuery.isLoading,
    isError: applicationsQuery.isError || schemesQuery.isError,
    approveApplication: approveMutation.mutateAsync,
    rejectApplication: rejectMutation.mutateAsync,
    isProcessing: approveMutation.isPending || rejectMutation.isPending,
  };
};

