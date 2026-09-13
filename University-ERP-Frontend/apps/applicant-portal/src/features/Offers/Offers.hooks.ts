import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { offersApi } from './Offers.api';
import { RespondOfferPayload } from './Offers.types';

export const useOfferDetails = (explicitStudentId?: string) => {
  const { user, identity } = useAuth();
  const studentId = explicitStudentId || user?.id || identity?.id;

  return useQuery({
    queryKey: ['applicantJourney', studentId],
    queryFn: () => offersApi.getApplicantJourney(studentId!),
    enabled: Boolean(studentId),
  });
};

export const useRespondOffer = (studentId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RespondOfferPayload) => offersApi.respondToOffer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicantJourney', studentId] });
      queryClient.invalidateQueries({ queryKey: ['admissionStatus'] });
    },
  });
};

